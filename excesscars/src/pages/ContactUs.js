import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import axios from 'axios';
import { GiFishingPole } from "react-icons/gi";
import usePageTracking from '../PageTracking';
import { trackEvent } from '../trackevents';

const ContactUs = () => {
  usePageTracking()
  const [successDiv, setSuccessDiv] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    trackEvent({
      action: "click_button",
      category: "User",
      label: "Contact Button",
      value: 1,
    });

    e.preventDefault(); // ✅ No backend yet
    axios.get('https://excesscarsapi.onrender.com/insertContact/?name=' + form.name + '&message=' + form.message + '&subject=' + form.subject + '&email=' + form.email + '&number=' + form.phone).then(() => {
      setSuccessDiv(true)
    })
  };

  return (
    <Container className="my-5">
      <Row style={{ position: 'relative' }} className="justify-content-center">
        <Col lg={8}>
          <Card
            className="shadow-lg border-0"
            style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: '15px'
            }}
          >
            <CardBody className="p-5">
              {/* Header */}
              <CardTitle tag="h2" className="text-center mb-4">
                Get in Touch
              </CardTitle>
              <CardText className="text-center text-muted mb-5">
                Have a question about RideBait, our vehicles, or how we work?
                Fill out the form below and we’ll get back to you as soon as possible.
              </CardText>

              {/* Contact Form */}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="phone">Phone</Label>
                      <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="subject">Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        value={form.subject}
                        id="subject"
                        placeholder="What’s this about?"
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="message">Message</Label>
                  <Input
                    type="textarea"
                    name="message"
                    id="message"
                    placeholder="Type your message here..."
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <div className="text-center mt-4">
                  <Button
                    color="primary"
                    size="lg"
                    style={{
                      borderRadius: '50px',
                      padding: '10px 40px',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <div
          id="success"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: '#fff',
            display: successDiv ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            borderRadius: '8px',
            animation: 'fadeInScale 0.4s ease-in-out'
          }}
        >
          <style>
            {`
              @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
              }
            `}
          </style>
          <GiFishingPole size={50} style={{ marginBottom: '15px' }} />
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Message Recieved!</h3>
          <p style={{ maxWidth: '300px', fontSize: '1rem', marginBottom: '5px' }}>
            Thank you for reaching out to us.
          </p>
          <p style={{ maxWidth: '300px', fontSize: '0.95rem', opacity: 0.9 }}>
            Please be patient as we review your request. Talk Soon :).
          </p>
          <Button
            color="light"
            onClick={() => setSuccessDiv(false)}
            style={{ marginTop: '20px', fontWeight: 'bold' }}
          >
            Close
          </Button>
        </div>
      </Row>
    </Container>
  );
};

export default ContactUs;
