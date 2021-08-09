import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";
import User from "./models/user.js";
import UserStats from "./models/userStats.js";
import Product from "./models/product.js";
import Tags from "./models/tags.js";
import UnitOfMeasure from "./models/unitOfMeasure.js";
import ProductCategories from "./models/productCategories.js";
import Token from "./models/token.js";

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
        },
      },
    },
  ],
});

const adminRouter = AdminBroExpress.buildRouter(adminBro);

export { adminBro, adminRouter };
