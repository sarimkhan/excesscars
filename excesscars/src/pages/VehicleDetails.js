import { useParams } from 'react-router';
import { Row, Container, Col, Card, CardHeader, CardBody, CardText, CardTitle, Input, Button } from 'reactstrap';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import SendOffer from '../components/OfferModal';


const VehicleDetails = (props) => {
    const [sendOfferModal, setSendOfferModal] = useState(false)
    const [offer, setOffer] = useState(0)
    const closeSendOffer = () => setSendOfferModal(!sendOfferModal)
    const { vin } = useParams()
    const [vehicleDetailsArr, setVehicleDetails] = useState("intial")
    const [carouselObjArr, setCarouselObjArr] = useState([])

    // get Vehicle Details using vin
    useEffect(() => {
        axios.get("https://excesscarsapi.onrender.com/getVehcileVin/?vin=" + vin.toString())
            .then(function (response) {
                console.log(response)
                setVehicleDetails(response.data)
            })
    }, [])

    //Function for images Slides
    useEffect(() => {
        try {
            if (vehicleDetailsArr !== "intial") {
                let imageURLs = vehicleDetailsArr[0][16].replace('{', '').replace('}', '').split(',')
                let tempCarouselArr = []
                for (let i = 0; i < imageURLs.length; i++) {
                    let tempString = { original: imageURLs[i], thumbnail: imageURLs[i], originalHeight: "height=300px" }
                    tempCarouselArr.push(tempString)
                }
                setCarouselObjArr(tempCarouselArr)
            }
        }
        catch {
            console.log("error")
        }

    }, [vehicleDetailsArr])

    return (
        <Container>
            <SendOffer thevin={vehicleDetailsArr[0][6]} theoffer={offer} isopen = {sendOfferModal} close = {closeSendOffer} />
            <Row>
                <Col lg={8} md={8} sm={12} xs={12}>
                    <ImageGallery additionalClass='image-gallery-image' items={carouselObjArr} />
                </Col>
                <Col lg={4} md={4} sm={12} xs={12}>
                    <Card
                        color="info"
                        inverse

                    >

                        <CardBody>
                            <Row className='my-3'>
                                <Col lg={6} md={6} sm={3} xs={6}>Dealer Price <br /> <h4 style={{ fontWeight: "bolder" }}>${vehicleDetailsArr[0][5]}</h4></Col>
                                <Col style={{ textAlign: "end" }} lg={6} md={6} sm={6} xs={6}>Potiential Savings <br /> <h4 style={{ fontWeight: "bolder", color: "green" }}>${(parseInt(vehicleDetailsArr[0][5]) - parseInt(vehicleDetailsArr[0][5] * .90)).toString()}</h4></Col>
                            </Row>
                            <Row className='my-3'>
                                <Col lg={8} sm={8} xs={8}>
                                    <Input onChange={(e)=>{setOffer(e.target.value)}} placeholder={"Suggested Offer $" + (parseInt(vehicleDetailsArr[0][5] * .90)).toString()}></Input>
                                </Col>
                                <Col lg={4} sm={4} xs={4}>
                                    <Button color='primary' onClick={()=>setSendOfferModal(true)}>
                                        Send Offer
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card
                        className='mt-2'
                        style={{ height: "70%" }}
                        color="primary"
                        inverse
                    >
                        <CardHeader>
                            <h5>Payment Calculator</h5>
                        </CardHeader>

                        <CardBody>
                            <Row className='my-3 text-center'>
                                <h5>Your Payments</h5>
                            </Row>
                            <Row className='my-3'>
                                <Col lg={6} sm={6} xs={6}>
                                    Your Offer $
                                    <Input value={(parseInt(vehicleDetailsArr[0][5] * .90)).toString()}></Input>
                                </Col>
                            </Row>
                            <Row className='my-3'>
                                <Col lg={6} sm={6} xs={6}>
                                    interest Rate %
                                    <Input value={3.8}></Input>
                                </Col>
                            </Row>
                            <Row className='my-3'>
                                <Col lg={6} sm={6} xs={6}>
                                    Term Months
                                    <Input value={60}></Input>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <h3>{vehicleDetailsArr[0][4]} {vehicleDetailsArr[0][2]} {vehicleDetailsArr[0][3]}</h3>
                <br />
                <Col lg={8} md={8} sm={12}>
                    <Row>
                        <Col lg={12} sm={12}>{vehicleDetailsArr[0][18]}</Col>
                        {/* <Col lg={12} sm={12} className='text-end' style={{fontSize:"12px"}}>{vehicleDetailsArr[0][12]} miles</Col> */}
                    </Row>

                </Col>

            </Row>
            <Row>
                <Col lg={8} md={8} sm={12} xs={12}>
                    <Tabs>
                        <TabList>
                            <Tab>Title 1</Tab>
                            <Tab>Title 2</Tab>
                        </TabList>

                        <TabPanel>
                            <h2>Any content 1</h2>
                        </TabPanel>
                        <TabPanel>
                            <h2>Any content 2</h2>
                        </TabPanel>
                    </Tabs>
                </Col>
            </Row>
        </Container>

    )

}

export default VehicleDetails;