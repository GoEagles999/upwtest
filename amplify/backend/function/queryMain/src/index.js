const { Sequelize } = require('sequelize');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const sequelize = new Sequelize(
    'postgres://postgres:Postgresql9@cd1jivy48i5s1y8.c4vdjvskpr34.eu-west-2.rds.amazonaws.com:5432/upw-poc'
  );

  await new Promise(async (res, rej) => {
    try {
    } catch (error) {}
  });
};
