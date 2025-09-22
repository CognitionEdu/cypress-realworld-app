import { describe, expect, it, beforeEach } from "vitest";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { join } from "path";
import resolvers from "../../backend/graphql/resolvers";

describe("GraphQL Schema", () => {
  let schema: any;

  beforeEach(() => {
    const loadedSchema = loadSchemaSync(join(__dirname, "../../backend/graphql/schema.graphql"), {
      loaders: [new GraphQLFileLoader()],
    });
    schema = addResolversToSchema({
      schema: loadedSchema,
      resolvers,
    });
  });

  it("should load schema without errors", () => {
    expect(schema).toBeDefined();
    expect(schema.getQueryType()).toBeDefined();
    expect(schema.getMutationType()).toBeDefined();
  });

  it("should have Query type with listBankAccount field", () => {
    const queryType = schema.getQueryType();
    expect(queryType).toBeDefined();
    expect(queryType!.getFields().listBankAccount).toBeDefined();

    const listBankAccountField = queryType!.getFields().listBankAccount;
    expect(listBankAccountField.type.toString()).toBe("[BankAccount!]");
  });

  it("should have Mutation type with createBankAccount and deleteBankAccount fields", () => {
    const mutationType = schema.getMutationType();
    expect(mutationType).toBeDefined();

    const fields = mutationType!.getFields();
    expect(fields.createBankAccount).toBeDefined();
    expect(fields.deleteBankAccount).toBeDefined();

    expect(fields.createBankAccount.type.toString()).toBe("BankAccount");
    expect(fields.deleteBankAccount.type.toString()).toBe("Boolean");
  });

  it("should have BankAccount type with correct fields", () => {
    const bankAccountType = schema.getType("BankAccount");
    expect(bankAccountType).toBeDefined();

    const fields = (bankAccountType as any).getFields();
    expect(fields.id).toBeDefined();
    expect(fields.uuid).toBeDefined();
    expect(fields.userId).toBeDefined();
    expect(fields.bankName).toBeDefined();
    expect(fields.accountNumber).toBeDefined();
    expect(fields.routingNumber).toBeDefined();
    expect(fields.isDeleted).toBeDefined();
    expect(fields.createdAt).toBeDefined();
    expect(fields.modifiedAt).toBeDefined();
  });

  it("should validate createBankAccount mutation arguments", () => {
    const mutationType = schema.getMutationType();
    const createBankAccountField = mutationType!.getFields().createBankAccount;

    const args = createBankAccountField.args;
    expect(args).toHaveLength(3);

    const bankNameArg = args.find((arg: any) => arg.name === "bankName");
    const accountNumberArg = args.find((arg: any) => arg.name === "accountNumber");
    const routingNumberArg = args.find((arg: any) => arg.name === "routingNumber");

    expect(bankNameArg).toBeDefined();
    expect(bankNameArg!.type.toString()).toBe("String!");

    expect(accountNumberArg).toBeDefined();
    expect(accountNumberArg!.type.toString()).toBe("String!");

    expect(routingNumberArg).toBeDefined();
    expect(routingNumberArg!.type.toString()).toBe("String!");
  });

  it("should validate deleteBankAccount mutation arguments", () => {
    const mutationType = schema.getMutationType();
    const deleteBankAccountField = mutationType!.getFields().deleteBankAccount;

    const args = deleteBankAccountField.args;
    expect(args).toHaveLength(1);

    const idArg = args.find((arg: any) => arg.name === "id");
    expect(idArg).toBeDefined();
    expect(idArg!.type.toString()).toBe("ID!");
  });
});
