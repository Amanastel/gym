import subdata from "../../submissionData.json"; // do not create this file
// let subdata = [{ submission_link: "http://localhost:8080/", id: 67890 }];
import "cypress-localstorage-commands";

// import { start, submitData } from "../../../data";
describe("Test", function () {
  let acc_score = 1;

  subdata.map(({ submission_link: url, id }) => {
    if (url.charAt(url.length - 1) != "/") {
      url = url + "/";
    }
    if (url && url.length) {
      beforeEach(() => {
        cy.restoreLocalStorage();
      });
      afterEach(() => {
        cy.saveLocalStorage();
      });

      it(`Check if the api call made`, () => {
        cy.intercept(
          `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-tech-products`
        ).as("apiRequest");
        cy.visit(url);
        cy.wait("@apiRequest").then((data) => {
          acc_score += 1;
        });
      }); // 1
      it(`Student is able to loop through the data and append in the dom`, () => {
        cy.visit(url);
        cy.get("#product-container")
          .children()
          .should("have.length", 16)
          .then(() => {
            acc_score += 0.5;
          });
        cy.get("#product-container")
          .should("have.css", "display", "grid")
          .then(() => {
            acc_score += 0.5;
          });
      }); // 1

      it(`Check the Filter Part`, () => {
        cy.get("#filter").select("Laptop");
        cy.get("#product-container>div")
          .should("have.length", 4)
          .then(() => {
            acc_score += 1;
          });
      }); // 1

      it(`Add a product to cart and check alert`, () => {
        cy.get("#product-container div")
          .eq(0)
          .children("button")
          .click()
          .then(() => {
            expect(JSON.parse(localStorage.getItem("cart")).length).to.eq(1);
            acc_score += 0.5;
          }); //1
        cy.on("window:alert", (str) => {
          expect(str).to.eq("Product Added To Cart");
          acc_score += 0.5;
        });
      }); // 1
      it(`Add same product to cart and check alert`, () => {
        cy.get("#product-container div")
          .eq(0)
          .children("button")
          .click()
          .then(() => {
            expect(JSON.parse(localStorage.getItem("cart")).length).to.eq(1);
            acc_score += 0.5;
          });
        cy.on("window:alert", (str) => {
          expect(str).to.eq("Product Already in Cart");
          acc_score += 0.5;
        });
      }); //1

      it(`Go To cart page and check if able to show on dom`, () => {
        cy.get(".nav a").eq(1).click();
        cy.get("#cart-container")
          .children()
          .should("have.length", 1)
          .then(() => {
            acc_score += 0.5;
          });
      }); // 0.5

      it(`Check the total Price part`, () => {
        cy.get("#cart-total")
          .contains(100)
          .then(() => {
            acc_score += 0.5;
          });
      }); // 0.5
      it(`Check the quantity part`, () => {
        cy.get("#cart-container span")
          .contains("1")
          .then(() => {
            acc_score += 0.5;
          });

        cy.get("#cart-container")
          .children()
          .eq(0)
          .contains("button", "+")
          .click();
        cy.get("#cart-container")
          .children()
          .eq(0)
          .contains("button", "+")
          .click();
        cy.get("#cart-container span")
          .eq(0)
          .contains(3)
          .then(() => {
            acc_score += 0.5;
          });
        cy.get("#cart-container")
          .children()
          .eq(0)
          .contains("button", "-")
          .click();
        cy.get("#cart-container span")
          .eq(0)
          .contains(2)
          .then(() => {
            acc_score += 0.5;
          });
      }); // 1.5

      it(`Check the total price after quantity increase`, () => {
        cy.get("#cart-total")
          .contains(200)
          .then(() => {
            acc_score += 0.5;
          });
      }); // 0.5

      it(`Check the delete part`, () => {
        cy.get("#cart-container")
          .children()
          .eq(0)
          .contains("button", "Remove")
          .click()
          .then(() => {
            expect(JSON.parse(localStorage.getItem("cart")).length).to.eq(0);
            acc_score += 0.5;
          });
        cy.get("#cart-container")
          .children()
          .should("have.length", 0)
          .then(() => {
            acc_score += 0.5;
          });
      }); // 1
    }

    it(`generate score`, () => {
      //////////////
      console.log(acc_score);
      let result = {
        id,
        marks: Math.floor(acc_score),
      };
      result = JSON.stringify(result);
      cy.writeFile("results.json", `\n${result},`, { flag: "a+" }, (err) => {
        if (err) {
          console.error(err);
        }
      });
      //////////////////
    });
  });
});
