import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { FaChartLine, FaHandshake, FaCarSide } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <Container fluid className="py-5" style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
      {/* Header */}
      <Row className="justify-content-center mb-5">
        <Col lg={8} className="text-center">
          <h1 className="display-5 fw-bold">How RideBait Works</h1>
          <p className="lead text-muted">
            We’re not just another car marketplace — we connect you only with **motivated dealers**  
            ready to negotiate, so you can close faster and save more.
          </p>
        </Col>
      </Row>

      {/* Steps */}
      <Row className="g-4 justify-content-center">
        <Col lg={3} md={6} sm={12}>
          <Card className="h-100 shadow-lg border-0 hover-scale" style={{ borderRadius: "15px" }}>
            <CardBody className="text-center p-4">
              <div className="icon-circle bg-primary bg-gradient text-white mb-3">
                <FaChartLine size={30} />
              </div>
              <CardTitle tag="h5" className="fw-bold">Step 1: We Gather the Data</CardTitle>
              <CardText className="text-muted mt-2">
                Constantly scanning market data & dealer inventories to find cars  
                **priced to move** — before the competition spots them.
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <Card className="h-100 shadow-lg border-0 hover-scale" style={{ borderRadius: "15px" }}>
            <CardBody className="text-center p-4">
              <div className="icon-circle bg-success bg-gradient text-white mb-3">
                <FaHandshake size={30} />
              </div>
              <CardTitle tag="h5" className="fw-bold">Step 2: Proprietary Algorithm</CardTitle>
              <CardText className="text-muted mt-2">
                Our algorithm flags dealers **ready to negotiate** using sales velocity,  
                stock aging, and pricing patterns — your shortcut to leverage.
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <Card className="h-100 shadow-lg border-0 hover-scale" style={{ borderRadius: "15px" }}>
            <CardBody className="text-center p-4">
              <div className="icon-circle bg-danger bg-gradient text-white mb-3">
                <FaCarSide size={30} />
              </div>
              <CardTitle tag="h5" className="fw-bold">Step 3: You Score a Deal</CardTitle>
              <CardText className="text-muted mt-2">
                Make an offer through RideBait — motivated dealers mean  
                **better chances** of landing your dream car at the right price.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Why RideBait */}
      <Row className="mt-5 justify-content-center">
        <Col lg={6} className="text-center">
          <h4 className="fw-bold mb-3">Why Choose RideBait?</h4>
          <p className="text-muted">
            Other marketplaces show you everything. We focus **only** on deals where  
            the dealer’s ready to talk — saving you **time, effort, and money**.
          </p>
          <Button
            color="primary"
            size="lg"
            href="/vehicles"
            style={{ borderRadius: "50px", padding: "10px 30px" }}
          >
            Browse Vehicles
          </Button>
        </Col>
      </Row>

      {/* Extra CSS */}
      <style>
        {`
          .hover-scale:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
          }
          .icon-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </Container>
  );
};

export default HowItWorks;
