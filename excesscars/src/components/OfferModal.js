import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input} from 'reactstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SendOffer = (props) => {

    const [modal, setModal] = useState(props.isopen);
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [number, setNumber] = useState()
    const [zipcode, setZipcode] = useState()
    const [offer, setOffer] = useState(props.theoffer)
    const [vin, setVin] = useState(props.thevin)
    useEffect(()=>{
      setOffer(props.theoffer)
      setVin(props.thevin)
    }, [name, email, number, zipcode])
    const closethemodal =()=>{
      axios.get("https://excesscarsapi.onrender.com/insertOffer/?name=" + name + "&email=" + email + "&number=" + number + "&zipcode=" + zipcode + "&offer=" + offer + "&vin=" + vin)
      props.close()
    }

    const toggle = () => setModal(!modal)
    return(
        <>
         <Modal style={{minWidth:"40%"}} isOpen={props.isopen} toggle={props.close} centered>
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
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={props.close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
        </>
    )
}

export default SendOffer;