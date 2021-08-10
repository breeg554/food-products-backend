import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import UserStats from "./models/userStats.js";
import Product from "./models/product.js";
import Tags from "./models/tags.js";
import UnitOfMeasure from "./models/unitOfMeasure.js";
import ProductCategories from "./models/productCategories.js";
import Token from "./models/token.js";
import { ACCESS_TOKEN_SECRET } from "./config/jwt.js";

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [
    User,
    // Product,
    Tags,
    UnitOfMeasure,
    ProductCategories,
    Token,
    UserStats,
    {
      resource: Product,
      options: {
        actions: {
          edit: {
            isVisible: true,

            handler: async (request, response, context) => {
              const { record, resource, currentAdmin, h, translateMessage } = context;

              if (!record) {
                throw new NotFoundError(
                  [`Record of given id ("${request.params.recordId}") could not be found`].join("\n"),
                  "Action#handler"
                );
              }
              const { status } = request.payload;
              if (request.method === "get") {
                return { record: record.toJSON(currentAdmin) };
              }
              const previousStatus = record.params.status;
              const newRecord = await record.update(request.payload);
              // // const [populatedRecord] = await populator([newRecord]);

              // // eslint-disable-next-line no-param-reassign
              // // context.record = populatedRecord;

              if (record.isValid()) {
                UserStats.updateStatsAfterUpdateProductStatus(record.params._authorId, status, previousStatus);
                return {
                  redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                  notice: {
                    message: translateMessage("successfullyUpdated", resource.id()),
                    type: "success",
                  },
                  record: newRecord.toJSON(currentAdmin),
                };
              }
              return {
                record: populatedRecord.toJSON(currentAdmin),
                notice: {
                  message: translateMessage("thereWereValidationErrors"),
                  type: "error",
                },
              };
            },
          },
          AcceptProduct: {
            actionType: "record",
            component: false,
            isVisible: (context) => context.record.param("status") === "in_progress",
            handler: async (request, response, context) => {
              const { record, resource, currentAdmin, h, translateMessage } = context;
              if (!request.params.recordId || !record) {
                throw new NotFoundError(['You have to pass "recordId" to update Action'].join("\n"), "Action#handler");
              }

              const newRecord = record.params;
              newRecord.status = "accepted";

              try {
                await record.update(newRecord);
              } catch (error) {
                if (error instanceof ValidationError && error.baseError) {
                  return {
                    record: record.toJSON(currentAdmin),
                    notice: {
                      message: error.baseError.message,
                      type: "error",
                    },
                  };
                }
                throw error;
              }
              UserStats.updateStatsAfterUpdateProductStatus(record.params._authorId, "accepted", "in_progress");
              return {
                redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                notice: {
                  message: translateMessage("successfullyUpdated", resource.id()),
                  type: "success",
                },
                record: record.toJSON(currentAdmin),
              };
            },
          },
        },
        listProperties: [
          "name",
          "_id",
          "unitOfMeasure",
          "nutrition.nutrients.calories.amount",
          "nutrition.nutrients.protein.amount",
          "nutrition.nutrients.carb.amount",
          "nutrition.nutrients.fat.amount",
        ],
      },
    },
  ],
});

const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user && user.role === "admin") {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: ACCESS_TOKEN_SECRET,
});

export { adminBro, adminRouter };
