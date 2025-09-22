import * as React from "react";
import TransactionCreateStepTwo from "./TransactionCreateStepTwo";
import { User } from "../models";

describe("TransactionCreateStepTwo", () => {
  const mockSender: User = {
    id: "sender123",
    uuid: "sender-uuid",
    firstName: "John",
    lastName: "Sender",
    username: "johnsender",
    password: "password",
    email: "john@example.com",
    phoneNumber: "555-0123",
    balance: 1000,
    avatar: "https://example.com/sender.jpg",
    defaultPrivacyLevel: "public" as any,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  const mockReceiver: User = {
    id: "receiver123",
    uuid: "receiver-uuid",
    firstName: "Jane",
    lastName: "Receiver",
    username: "janereceiver",
    password: "password",
    email: "jane@example.com",
    phoneNumber: "555-0456",
    balance: 500,
    avatar: "https://example.com/receiver.jpg",
    defaultPrivacyLevel: "public" as any,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  it("should render form with receiver information", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.contains(`${mockReceiver.firstName} ${mockReceiver.lastName}`).should("exist");
    cy.get("[data-test='transaction-create-form']").should("exist");
    cy.get("[data-test='transaction-create-amount-input']").should("exist");
    cy.get("[data-test='transaction-create-description-input']").should("exist");
  });

  it("should have disabled submit buttons initially", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.get("[data-test='transaction-create-submit-request']").should("be.disabled");
    cy.get("[data-test='transaction-create-submit-payment']").should("be.disabled");
  });

  it("should enable submit buttons when form is valid", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.get("[data-test='transaction-create-amount-input']").type("100");
    cy.get("[data-test='transaction-create-description-input']").type("Test payment");

    cy.get("[data-test='transaction-create-submit-request']").should("not.be.disabled");
    cy.get("[data-test='transaction-create-submit-payment']").should("not.be.disabled");
  });

  it("should call createTransaction when payment button is clicked", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.get("[data-test='transaction-create-amount-input']").type("100");
    cy.get("[data-test='transaction-create-description-input']").type("Test payment");
    cy.get("[data-test='transaction-create-submit-payment']").click();

    cy.then(() => {
      expect(createTransactionSpy).to.have.been.calledOnce;
      expect(showSnackbarSpy).to.have.been.calledWith({
        severity: "success",
        message: "Transaction Submitted!",
      });
    });
  });

  it("should call createTransaction when request button is clicked", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.get("[data-test='transaction-create-amount-input']").type("50");
    cy.get("[data-test='transaction-create-description-input']").type("Test request");
    cy.get("[data-test='transaction-create-submit-request']").click();

    cy.then(() => {
      expect(createTransactionSpy).to.have.been.calledOnce;
      expect(showSnackbarSpy).to.have.been.calledWith({
        severity: "success",
        message: "Transaction Submitted!",
      });
    });
  });

  it("should display receiver avatar", () => {
    const createTransactionSpy = cy.spy();
    const showSnackbarSpy = cy.spy();

    cy.mount(
      <TransactionCreateStepTwo
        receiver={mockReceiver}
        sender={mockSender}
        createTransaction={createTransactionSpy}
        showSnackbar={showSnackbarSpy}
      />
    );

    cy.get("img").should("have.attr", "src", mockReceiver.avatar);
  });
});
