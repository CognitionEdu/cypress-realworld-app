import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  getBankAccountsByUserId,
  createBankAccountForUser,
  removeBankAccountById,
  getRandomUser,
  seedDatabase,
} from "../../backend/database";
import { User } from "../../src/models/user";
import { BankAccount } from "../../src/models/bankaccount";
import Query from "../../backend/graphql/resolvers/Query";
import Mutation from "../../backend/graphql/resolvers/Mutation";

describe("GraphQL Resolvers", () => {
  beforeEach(() => {
    seedDatabase();
  });

  describe("Query resolvers", () => {
    it("should resolve listBankAccount for authenticated user", () => {
      const user: User = getRandomUser();
      const mockContext = { user };

      const result = Query.listBankAccount({}, {}, mockContext);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0].userId).toBe(user.id);
      }
    });

    it("should handle listBankAccount when user has no bank accounts", () => {
      const user: User = getRandomUser();
      const existingAccounts = getBankAccountsByUserId(user.id);
      existingAccounts.forEach((account: any) => removeBankAccountById(account.id));

      const mockContext = { user };
      const result = Query.listBankAccount({}, {}, mockContext);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.filter((acc: any) => !acc.isDeleted).length).toBe(0);
    });

    it("should throw error when context user is missing", () => {
      const mockContext = {};

      expect(() => {
        Query.listBankAccount({}, {}, mockContext);
      }).toThrow();
    });

    it("should return only non-deleted bank accounts", () => {
      const user: User = getRandomUser();
      const mockContext = { user };

      const result = Query.listBankAccount({}, {}, mockContext);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      result.forEach((account: BankAccount) => {
        expect(account.isDeleted).toBe(false);
        expect(account.userId).toBe(user.id);
      });
    });
  });

  describe("Mutation resolvers", () => {
    it("should resolve createBankAccount with valid input", () => {
      const user: User = getRandomUser();
      const mockArgs = {
        bankName: `${faker.company.companyName()} Bank`,
        accountNumber: faker.finance.account(10),
        routingNumber: faker.finance.account(9),
      };
      const mockContext = { user };

      const result = Mutation.createBankAccount({}, mockArgs, mockContext);

      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.bankName).toBe(mockArgs.bankName);
      expect(result.accountNumber).toBe(mockArgs.accountNumber);
      expect(result.routingNumber).toBe(mockArgs.routingNumber);
      expect(result.id).toBeDefined();
      expect(result.isDeleted).toBe(false);
      expect(result.uuid).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.modifiedAt).toBeDefined();
    });

    it("should resolve deleteBankAccount with valid ID", () => {
      const user: User = getRandomUser();
      const accounts = getBankAccountsByUserId(user.id);
      const bankAccountId = accounts[0].id;

      const mockArgs = { id: bankAccountId };
      const mockContext = { user };

      const result = Mutation.deleteBankAccount({}, mockArgs, mockContext);

      expect(result).toBe(true);

      const updatedAccounts = getBankAccountsByUserId(user.id);
      const deletedAccount = updatedAccounts.find((acc: any) => acc.id === bankAccountId);
      expect(deletedAccount?.isDeleted).toBe(true);
    });

    it("should handle deleteBankAccount with non-existent ID", () => {
      const user: User = getRandomUser();
      const mockArgs = { id: "non-existent-id" };
      const mockContext = { user };

      const result = Mutation.deleteBankAccount({}, mockArgs, mockContext);
      expect(result).toBe(true);
    });

    it("should handle createBankAccount when context user is missing", () => {
      const mockArgs = {
        bankName: "Test Bank",
        accountNumber: "1234567890",
        routingNumber: "123456789",
      };
      const mockContext = {};

      expect(() => {
        Mutation.createBankAccount({}, mockArgs, mockContext);
      }).toThrow();
    });

    it("should handle deleteBankAccount when context user is missing", () => {
      const mockArgs = { id: "some-id" };
      const mockContext = {};

      const result = Mutation.deleteBankAccount({}, mockArgs, mockContext);
      expect(result).toBe(true);
    });

    it("should create bank account with all required fields", () => {
      const user: User = getRandomUser();
      const mockArgs = {
        bankName: "Test Bank Name",
        accountNumber: "9876543210",
        routingNumber: "987654321",
      };
      const mockContext = { user };

      const result = Mutation.createBankAccount({}, mockArgs, mockContext);

      expect(result.bankName).toBe("Test Bank Name");
      expect(result.accountNumber).toBe("9876543210");
      expect(result.routingNumber).toBe("987654321");
      expect(typeof result.id).toBe("string");
      expect(typeof result.uuid).toBe("string");
      expect(result.createdAt).toBeDefined();
      expect(result.modifiedAt).toBeDefined();
    });
  });

  describe("Integration with database functions", () => {
    it("should create and retrieve bank account through resolvers", () => {
      const user: User = getRandomUser();
      const mockArgs = {
        bankName: `${faker.company.companyName()} Bank`,
        accountNumber: faker.finance.account(10),
        routingNumber: faker.finance.account(9),
      };
      const mockContext = { user };

      const createdAccount = Mutation.createBankAccount({}, mockArgs, mockContext);
      expect(createdAccount).toBeDefined();

      const accounts = Query.listBankAccount({}, {}, mockContext);
      const foundAccount = accounts.find((acc: BankAccount) => acc.id === createdAccount.id);

      expect(foundAccount).toBeDefined();
      expect(foundAccount.bankName).toBe(mockArgs.bankName);
      expect(foundAccount.accountNumber).toBe(mockArgs.accountNumber);
      expect(foundAccount.routingNumber).toBe(mockArgs.routingNumber);
    });

    it("should handle complete workflow: create, list, delete", () => {
      const user: User = getRandomUser();
      const mockContext = { user };

      const initialAccounts = Query.listBankAccount({}, {}, mockContext);
      const initialActiveCount = initialAccounts.filter((acc: any) => !acc.isDeleted).length;

      const createArgs = {
        bankName: "Workflow Test Bank",
        accountNumber: "1111111111",
        routingNumber: "111111111",
      };

      const createdAccount = Mutation.createBankAccount({}, createArgs, mockContext);
      expect(createdAccount).toBeDefined();

      const accountsAfterCreate = Query.listBankAccount({}, {}, mockContext);
      const activeAfterCreate = accountsAfterCreate.filter((acc: any) => !acc.isDeleted).length;
      expect(activeAfterCreate).toBe(initialActiveCount + 1);

      const deleteResult = Mutation.deleteBankAccount({}, { id: createdAccount.id }, mockContext);
      expect(deleteResult).toBe(true);

      const accountsAfterDelete = Query.listBankAccount({}, {}, mockContext);
      const activeAfterDelete = accountsAfterDelete.filter((acc: any) => !acc.isDeleted).length;
      expect(activeAfterDelete).toBe(initialActiveCount);
    });

    it("should maintain data consistency across operations", () => {
      const user: User = getRandomUser();
      const mockContext = { user };

      const createArgs = {
        bankName: "Consistency Test Bank",
        accountNumber: "2222222222",
        routingNumber: "222222222",
      };

      const createdAccount = Mutation.createBankAccount({}, createArgs, mockContext);

      const retrievedAccounts = Query.listBankAccount({}, {}, mockContext);
      const matchingAccount = retrievedAccounts.find(
        (acc: BankAccount) => acc.id === createdAccount.id
      );

      expect(matchingAccount).toBeDefined();
      expect(matchingAccount.userId).toBe(user.id);
      expect(matchingAccount.bankName).toBe(createArgs.bankName);
      expect(matchingAccount.accountNumber).toBe(createArgs.accountNumber);
      expect(matchingAccount.routingNumber).toBe(createArgs.routingNumber);
      expect(matchingAccount.isDeleted).toBe(false);
    });
  });
});
