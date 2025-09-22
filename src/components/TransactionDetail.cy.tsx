import * as React from "react";
import TransactionDetail from "./TransactionDetail";
import { User, TransactionResponseItem } from "../models";

describe("TransactionDetail", () => {
  const mockCurrentUser: User = {
    id: "user123",
    uuid: "uuid123",
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    password: "password",
    email: "test@example.com",
    phoneNumber: "555-0123",
    balance: 1000,
    avatar: "https://example.com/avatar.jpg",
    defaultPrivacyLevel: "public" as any,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  it("should render transaction details", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      const transactionLikeSpy = cy.spy();
      const transactionCommentSpy = cy.spy();
      const transactionUpdateSpy = cy.spy();

      cy.mount(
        <TransactionDetail
          transaction={transaction}
          transactionLike={transactionLikeSpy}
          transactionComment={transactionCommentSpy}
          transactionUpdate={transactionUpdateSpy}
          currentUser={mockCurrentUser}
        />
      );

      cy.get("[data-test='transaction-detail-header']").should("contain", "Transaction Detail");
      cy.get("[data-test='transaction-sender-avatar']").should("exist");
      cy.get("[data-test='transaction-receiver-avatar']").should("exist");
      cy.get("[data-test='transaction-description']").should("contain", transaction.description);
    });
  });

  it("should handle like button click", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      const transactionLikeSpy = cy.spy();
      const transactionCommentSpy = cy.spy();
      const transactionUpdateSpy = cy.spy();

      cy.mount(
        <TransactionDetail
          transaction={transaction}
          transactionLike={transactionLikeSpy}
          transactionComment={transactionCommentSpy}
          transactionUpdate={transactionUpdateSpy}
          currentUser={mockCurrentUser}
        />
      );

      cy.get(`[data-test='transaction-like-button-${transaction.id}']`).click();
      cy.then(() => {
        expect(transactionLikeSpy).to.have.been.calledWith(transaction.id);
      });
    });
  });

  it("should show accept/reject buttons for pending requests when current user is receiver", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const pendingTransaction: TransactionResponseItem = {
        ...transactions.results[2],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
        receiverId: mockCurrentUser.id,
      };

      const transactionLikeSpy = cy.spy();
      const transactionCommentSpy = cy.spy();
      const transactionUpdateSpy = cy.spy();

      cy.mount(
        <TransactionDetail
          transaction={pendingTransaction}
          transactionLike={transactionLikeSpy}
          transactionComment={transactionCommentSpy}
          transactionUpdate={transactionUpdateSpy}
          currentUser={mockCurrentUser}
        />
      );

      cy.get(`[data-test='transaction-accept-request-${pendingTransaction.id}']`).should("exist");
      cy.get(`[data-test='transaction-reject-request-${pendingTransaction.id}']`).should("exist");
    });
  });

  it("should display like count", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      const transactionLikeSpy = cy.spy();
      const transactionCommentSpy = cy.spy();
      const transactionUpdateSpy = cy.spy();

      cy.mount(
        <TransactionDetail
          transaction={transaction}
          transactionLike={transactionLikeSpy}
          transactionComment={transactionCommentSpy}
          transactionUpdate={transactionUpdateSpy}
          currentUser={mockCurrentUser}
        />
      );

      cy.get(`[data-test='transaction-like-count-${transaction.id}']`).should(
        "contain",
        transaction.likes.length
      );
    });
  });
});
