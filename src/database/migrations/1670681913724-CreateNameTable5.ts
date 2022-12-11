import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNameTable51670681913724 implements MigrationInterface {
  name = 'CreateNameTable51670681913724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_207eadbaa38ce8cf46256425195"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_5198460192ebbd084ffbb5aebd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" DROP CONSTRAINT "FK_b97f0b17f1008203686da64ff93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" DROP CONSTRAINT "FK_0b81361b6fa9373a900198adbed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5198460192ebbd084ffbb5aebd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_207eadbaa38ce8cf4625642519"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b81361b6fa9373a900198adbe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b97f0b17f1008203686da64ff9"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_products" ("orderId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_ffd362cc3722cddd5bd60d153aa" PRIMARY KEY ("orderId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28b66449cf7cd76444378ad4e9" ON "order_products" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27ca18f2453639a1cafb7404ec" ON "order_products" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" DROP COLUMN "discount"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "order-products_orderId_seq" OWNED BY "order-products"."orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ALTER COLUMN "orderId" SET DEFAULT nextval('"order-products_orderId_seq"')`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "order-products_productId_seq" OWNED BY "order-products"."productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ALTER COLUMN "productId" SET DEFAULT nextval('"order-products_productId_seq"')`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5198460192ebbd084ffbb5aebd" ON "brands_categories" ("brandId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_207eadbaa38ce8cf4625642519" ON "brands_categories" ("categoriesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_5198460192ebbd084ffbb5aebd7" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_207eadbaa38ce8cf46256425195" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" ADD CONSTRAINT "FK_28b66449cf7cd76444378ad4e92" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" ADD CONSTRAINT "FK_27ca18f2453639a1cafb7404ece" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_products" DROP CONSTRAINT "FK_27ca18f2453639a1cafb7404ece"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" DROP CONSTRAINT "FK_28b66449cf7cd76444378ad4e92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_207eadbaa38ce8cf46256425195"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_5198460192ebbd084ffbb5aebd7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_207eadbaa38ce8cf4625642519"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5198460192ebbd084ffbb5aebd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ALTER COLUMN "productId" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "order-products_productId_seq"`);
    await queryRunner.query(
      `ALTER TABLE "order-products" ALTER COLUMN "orderId" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "order-products_orderId_seq"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ADD "discount" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_27ca18f2453639a1cafb7404ec"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28b66449cf7cd76444378ad4e9"`,
    );
    await queryRunner.query(`DROP TABLE "order_products"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_b97f0b17f1008203686da64ff9" ON "order-products" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b81361b6fa9373a900198adbe" ON "order-products" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_207eadbaa38ce8cf4625642519" ON "brands_categories" ("categoriesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5198460192ebbd084ffbb5aebd" ON "brands_categories" ("brandId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ADD CONSTRAINT "FK_0b81361b6fa9373a900198adbed" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-products" ADD CONSTRAINT "FK_b97f0b17f1008203686da64ff93" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_5198460192ebbd084ffbb5aebd7" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_207eadbaa38ce8cf46256425195" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
