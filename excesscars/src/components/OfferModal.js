import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input} from 'reactstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GiFishingPole } from "react-icons/gi";

const SendOffer = (props) => {

    const [modal, setModal] = useState(props.isopen);
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [number, setNumber] = useState()
    const [zipcode, setZipcode] = useState()
    const [offer, setOffer] = useState(props.theoffer)
    const [vin, setVin] = useState(props.thevin)
    const [successDiv, setSuccessDiv] = useState(false)
    useEffect(()=>{
      setOffer(props.theoffer)
      setVin(props.thevin)
    }, [name, email, number, zipcode])
    const closethemodal =()=>{
      axios.get("https://excesscarsapi.onrender.com/insertOffer/?name=" + name + "&email=" + email + "&number=" + number + "&zipcode=" + zipcode + "&offer=" + offer + "&vin=" + vin).then(()=>{
        setSuccessDiv(true)
      })
    }

    const toggle = () => setModal(!modal)
    return(
        <>
        <div>
          
        </div>
         <Modal style={{minWidth:"40%"}} isOpen={props.isopen} toggle={props.close} centered>
          <div>
        <ModalHeader>Your Offer ${props.theoffer}</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mt-3' lg={6} md={6} sm={6}>
            Full Name
            <Input placeholder='Your Full Name' onChange={(e)=>{setName(e.target.value)}}/>
            </Col>
            <Col className='mt-3' lg={6} md={6} sm={6}>
            Email
            <Input placeholder='Your Email' onChange={(e)=>{setEmail(e.target.value)}}/>
            </Col>
            <Col className='mt-3' lg={6} md={6} sm={6}>
            Phone Number
            <Input placeholder='Mobile Number' onChange={(e)=>{setNumber(e.target.value)}}/>
            </Col>
            <Col className='mt-3' lg={6} md={6} sm={6}>
            Zipcode
            <Input placeholder='Your Zipcode' onChange={(e)=>{setZipcode(e.target.value)}}/>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closethemodal}>
            Send Offer
          </Button>{' '}
          <Button color="secondary" onClick={props.close}>
            Cancel
          </Button>
        </ModalFooter>
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
  <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Offer Sent!</h3>
  <p style={{ maxWidth: '300px', fontSize: '1rem', marginBottom: '5px' }}>
    You successfully threw a bait to the dealer.
  </p>
  <p style={{ maxWidth: '300px', fontSize: '0.95rem', opacity: 0.9 }}>
    Let’s be patient and wait for them to catch it.
  </p>
  <Button
    color="light"
    onClick={props.close}
    style={{ marginTop: '20px', fontWeight: 'bold' }}
  >
    Close
  </Button>
</div>
        </div>
      </Modal>
        </>
    )
}

export default SendOffer;