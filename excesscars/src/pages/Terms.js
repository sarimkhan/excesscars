import React from "react";
import { Container } from "reactstrap";

const TermsAndConditions = () => {
  return (
    <Container style={{ marginTop: "40px", marginBottom: "40px", lineHeight: "1.6" }}>
      <h1 style={{ fontWeight: "bold", marginBottom: "20px" }}>Terms & Conditions</h1>

      <section style={{ marginBottom: "20px" }}>
        <h4 style={{ fontWeight: "600" }}>1. Savings Disclaimer</h4>
        <p>
          The savings displayed on this platform are provided as an <strong>estimate only</strong>.
          They are based on general market factors and do not represent a guaranteed discount or price reduction.
          All final pricing, savings, and terms are determined exclusively through the negotiation
          between you (the user) and the dealership offering the vehicle.
        </p>
        <p>
          <strong>RideBait</strong> is not a party to any negotiation or agreement between you and the dealership.
          We do not guarantee, validate, or enforce any pricing, discount, or terms discussed between you and the dealer.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h4 style={{ fontWeight: "600" }}>2. User Acknowledgement & Data Sharing</h4>
        <p>
          By submitting the "Send Offer" form, you acknowledge and agree that the information you provide,
          including your name, contact details, offer amount, and any other relevant details,
          will be shared directly with the dealership that owns the specific vehicle you are inquiring about.
        </p>
        <p>
          This data is provided solely for the purpose of enabling the dealership to respond to your inquiry
          and continue communication related to the potential sale of the vehicle.
          <strong> RideBait</strong> is not responsible for how the dealership uses your information
          after it has been shared, and we recommend reviewing the dealership’s own privacy policy.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h4 style={{ fontWeight: "600" }}>3. Limitation of Liability</h4>
        <p>
          Under no circumstances will RideBait be held liable for any losses, damages, disputes,
          or misunderstandings that may arise as a result of your negotiations or transactions with a dealership.
          You are solely responsible for ensuring that you understand and agree to the final terms of any deal
          you enter into with a dealership.
        </p>
      </section>

      <p style={{ fontStyle: "italic", marginTop: "30px" }}>
        By using this platform and submitting an offer, you confirm that you have read, understood,
        and agreed to these Terms & Conditions.
      </p>
    </Container>
  );
};

export default TermsAndConditions;
