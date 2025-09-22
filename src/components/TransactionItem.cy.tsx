import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import TransactionItem from "./TransactionItem";
import { TransactionResponseItem } from "../models";

describe("TransactionItem", () => {
  it("should render transaction item with social stats", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      cy.mount(
        <MemoryRouter>
          <TransactionItem transaction={transaction} />
        </MemoryRouter>
      );

      cy.get(`[data-test='transaction-item-${transaction.id}']`).should("exist");
      cy.get("[data-test='transaction-like-count']").should("contain", transaction.likes.length);
      cy.get("[data-test='transaction-comment-count']").should(
        "contain",
        transaction.comments.length
      );
    });
  });

  it("should be clickable for navigation", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      cy.mount(
        <MemoryRouter>
          <TransactionItem transaction={transaction} />
        </MemoryRouter>
      );

      cy.get(`[data-test='transaction-item-${transaction.id}']`).should("exist");
      cy.get(`[data-test='transaction-item-${transaction.id}']`).click();
    });
  });

  it("should display sender and receiver avatars", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      cy.mount(
        <MemoryRouter>
          <TransactionItem transaction={transaction} />
        </MemoryRouter>
      );

      cy.get("img").should("have.length.at.least", 2);
    });
  });

  it("should display transaction description", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const transaction: TransactionResponseItem = {
        ...transactions.results[0],
        senderAvatar: "https://example.com/sender.jpg",
        receiverAvatar: "https://example.com/receiver.jpg",
      };

      cy.mount(
        <MemoryRouter>
          <TransactionItem transaction={transaction} />
        </MemoryRouter>
      );

      cy.contains(transaction.description).should("exist");
    });
  });
});
