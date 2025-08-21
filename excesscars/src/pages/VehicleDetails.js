import { useParams } from 'react-router';
import { Row, Container, Col, Card, CardBody, Input, Button } from 'reactstrap';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ImageGallery from "react-image-gallery";
import { IoSpeedometer } from "react-icons/io5";
import "react-image-gallery/styles/css/image-gallery.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SendOffer from '../components/OfferModal';
import ReactGA from 'react-ga4';

const VehicleDetails = () => {
    const [sendOfferModal, setSendOfferModal] = useState(false);
    const [offer, setOffer] = useState(0);
    const closeSendOffer = () => setSendOfferModal(!sendOfferModal);
    const { vin } = useParams();
    const [vehicleDetailsArr, setVehicleDetails] = useState("initial");
    const [carouselObjArr, setCarouselObjArr] = useState([]);

    // Financing states
    const [vehiclePrice, setVehiclePrice] = useState(0);
    const [downPayment, setDownPayment] = useState(0);
    const [tradeInValue, setTradeInValue] = useState(0);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(60);

    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalLoanCost, setTotalLoanCost] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    // Fetch Vehicle Details
    useEffect(() => {
        axios.get("https://excesscarsapi.onrender.com/getVehcileVin/?vin=" + vin.toString())
            .then((response) => {
                setVehicleDetails(response.data);
                const price = parseFloat(response.data[0][5]);
                setVehiclePrice(price);
                ReactGA.initialize('G-QZ4EFNV649');
                // Send pageview with a custom path
                ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: response.data[0][4] + " " + response.data[0][2] + " " + response.data[0][3] + " Details Page" });
            });
    }, [vin]);

    // Prepare carousel images
    useEffect(() => {
        if (vehicleDetailsArr !== "initial") {
            try {
                let text = vehicleDetailsArr[0][16].replace('{', '').replace('}', '')
                let imgUrls = [...text.matchAll(/"([^"]+)"/g)].map(match => match[1]);
                let imageURLs = vehicleDetailsArr[0][16].replace('{', '').replace('}', '').split(',');
                if (imgUrls.length === 0) {
                    let tempCarouselArr = imageURLs.map(url => ({
                        original: url,
                        thumbnail: url,
                        originalHeight: "height=300px"
                    }));
                    setCarouselObjArr(tempCarouselArr);
                }
                else {
                    let tempCarouselArr = imgUrls.map(url => ({
                        original: url,
                        thumbnail: url,
                        originalHeight: "height=300px"
                    }));
                    setCarouselObjArr(tempCarouselArr);
                }

            } catch {
                console.log("error loading images");
            }
        }
    }, [vehicleDetailsArr]);

    // Financing calculations
    useEffect(() => {
        const principal = vehiclePrice - downPayment - tradeInValue;
        const monthlyRate = interestRate / 100 / 12;
        const n = loanTerm;

        if (principal > 0 && monthlyRate > 0) {
            const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                (Math.pow(1 + monthlyRate, n) - 1);
            setMonthlyPayment(payment);
            setTotalLoanCost(payment * n);
            setTotalInterest((payment * n) - principal);
        } else {
            setMonthlyPayment(principal / n);
            setTotalLoanCost(principal);
            setTotalInterest(0);
        }
    }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm]);
    console.log(vehicleDetailsArr)
    return (

        <Container className="vehicle-details-container">
            <style>{`
                .vehicle-details-container { margin-top: 20px; animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .vehicle-title h2 { font-weight: 700; }
                .vehicle-subtitle { color: #666; font-size: 1rem; }
                .modern-tabs .react-tabs__tab-list { border-bottom: 2px solid #eee; }
                .modern-tabs .react-tabs__tab {
                    padding: 10px 20px;
                    font-weight: 500;
                    cursor: pointer;
                    border: none;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                }
                .modern-tabs .react-tabs__tab:hover {
                    color: #007bff;
                    background: #f8f9fa;
                    border-radius: 8px 8px 0 0;
                }
                .modern-tabs .react-tabs__tab--selected {
                    border-bottom: 3px solid #007bff;
                    color: #007bff;
                    font-weight: 600;
                }
                .price-card, .finance-card, .specs-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    padding: 20px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .price-card:hover, .finance-card:hover, .specs-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
                }
                .price-card { color: #007bff; font-weight: bold; }
                .price-card .savings-text { color: green; font-weight: 900; font-size:13px}
                .specs-heading { font-weight: 600; margin-top: 15px; margin-bottom: 10px; color: #007bff; }
                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 10px;
                }
                .payment-summary {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    animation: fadeIn 0.6s ease-in-out;
                }
                .payment-summary h2 { color: #007bff; font-weight: bold; }
            `}</style>

            {vehicleDetailsArr !== "initial" && (
                <>
                    <SendOffer
                        thevin={vehicleDetailsArr[0][6]}
                        theoffer={offer}
                        isopen={sendOfferModal}
                        close={closeSendOffer}
                    />
                    <Row>
                        {/* Left column */}
                        <Col lg={8} md={8} sm={12} xs={12}>
                            <ImageGallery additionalClass='image-gallery-image' items={carouselObjArr} />
                            <div className="vehicle-title mt-3">
                                <h2>{vehicleDetailsArr[0][4]} {vehicleDetailsArr[0][2]} {vehicleDetailsArr[0][3]}</h2>
                                <p className="vehicle-subtitle">{vehicleDetailsArr[0][18]} - <span className='ms-auto' style={{ fontWeight: 'bold' }}><IoSpeedometer style={{ marginTop: '-5px' }} />{parseInt(vehicleDetailsArr[0][12]).toLocaleString()} miles</span></p>
                            </div>


                        </Col>

                        {/* Right column */}
                        <Col lg={4} md={4} sm={12} xs={12}>
                            <Card className="price-card">
                                <Row>
                                    <Col className='text-center' lg={6} md={6} sm={6} xs={6}>
                                        <h5 className='text-black'>Dealer Price</h5>
                                        <h3 style={{ color: 'black' }}>${parseInt(vehicleDetailsArr[0][5]).toLocaleString()}</h3>
                                    </Col>
                                    <Col className='text-center' lg={6} md={6} sm={6} xs={6}>
                                        <h5>Sugg. Offer</h5>
                                        <h3 style={{ color: '#007bff', fontWeight: 'bold' }}>${(parseInt(vehicleDetailsArr[0][5] * .928)).toLocaleString()}</h3>
                                    </Col>
                                </Row>

                                <p className="savings-text">
                                    Potential Savings: <span>${(parseInt(vehicleDetailsArr[0][5]) - (parseInt(vehicleDetailsArr[0][5] * .928))).toLocaleString()}</span>
                                </p>
                                <div style={{
                                    position: 'absolute', left:'55%', top:'38%',
                                    width:'40%', height:'3vh',
                                    textAlign:'center',
                                    padding: '3px', borderRadius: '20px',
                                    background: 'linear-gradient(90deg, #dc3545, #ff6b6b)',
                                    color: 'white', fontWeight: 'bold', fontSize: '11px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                                }}>
                                    <p>Financing Available</p>
                                </div>

                                <Input className="mb-2 mt-2"
                                    onChange={(e) => { setOffer(e.target.value) }}
                                    placeholder={"Suggested Offer $" + (parseInt(vehicleDetailsArr[0][5] * .928)).toLocaleString()}
                                />
                                <Button color='primary' block onClick={() => {
                                    setSendOfferModal(true);

                                    ReactGA.event({
                                        category: 'ButtonClick',
                                        action: 'Click',
                                        label: 'OfferInitiate',
                                    });

                                }}>
                                    Send Offer
                                </Button>
                            </Card>
                        </Col>
                        <Col lg={8} md={8} sm={12} xs={12}>
                            <Tabs className="modern-tabs mt-4">
                                <TabList>
                                    <Tab>Specifications</Tab>
                                    <Tab onClick={() => {
                                        ReactGA.event({
                                            category: 'ButtonClick',
                                            action: 'Click',
                                            label: 'FinancingCalc',
                                        });
                                    }}>Financing</Tab>
                                </TabList>

                                {/* Specs Tab */}
                                <TabPanel>
                                    <div className="specs-card">
                                        <div className="specs-heading">Performance</div>
                                        <div className="specs-grid">
                                            <p><strong>Engine:</strong> {vehicleDetailsArr[0][19]}</p>
                                            <p><strong>Transmission:</strong> {vehicleDetailsArr[0][10]}</p>
                                            <p><strong>Drive Terrain:</strong> {vehicleDetailsArr[0][20]}</p>
                                            <p><strong>MPG:</strong> {vehicleDetailsArr[0][13]} City / {vehicleDetailsArr[0][14]} Hwy</p>
                                        </div>

                                        <div className="specs-heading">Appearance</div>
                                        <div className="specs-grid">
                                            <p><strong>Interior Color:</strong> {vehicleDetailsArr[0][8]}</p>
                                            <p><strong>Exterior Color:</strong> {vehicleDetailsArr[0][7]}</p>
                                            <p><strong>Trim:</strong> {vehicleDetailsArr[0][17]}</p>
                                            <p><strong>Trim Version:</strong> {vehicleDetailsArr[0][18]}</p>
                                        </div>

                                        <div className="specs-heading">Details</div>
                                        <div className="specs-grid">
                                            <p><strong>Body Type:</strong> {vehicleDetailsArr[0][11]}</p>
                                            <p><strong>Fuel Type:</strong> {vehicleDetailsArr[0][9]}</p>
                                            <p><strong>Doors:</strong> {vehicleDetailsArr[0][21]}</p>
                                            <p><strong>VIN:</strong> {vehicleDetailsArr[0][6]}</p>
                                            <p><strong>Miles:</strong> {parseInt(vehicleDetailsArr[0][12]).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </TabPanel>

                                {/* Financing Tab */}
                                <TabPanel>
                                    <Card className="finance-card">
                                        <h5 className="mb-3">Financing Calculator</h5>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                Vehicle Price
                                                <Input type="number" value={vehiclePrice}
                                                    onChange={(e) => setVehiclePrice(parseFloat(e.target.value) || 0)} />
                                            </Col>
                                            <Col md={6}>
                                                Down Payment
                                                <Input type="number" value={downPayment}
                                                    onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)} />
                                            </Col>
                                            <Col md={6}>
                                                Trade-in Value
                                                <Input type="number" value={tradeInValue}
                                                    onChange={(e) => setTradeInValue(parseFloat(e.target.value) || 0)} />
                                            </Col>
                                            <Col md={6}>
                                                Interest Rate (%)
                                                <Input type="number" value={interestRate}
                                                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} />
                                            </Col>
                                            <Col md={6}>
                                                Loan Term (months)
                                                <Input type="number" value={loanTerm}
                                                    onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)} />
                                            </Col>
                                        </Row>

                                        <div className="payment-summary mt-4">
                                            <h4>Estimated Payment</h4>
                                            <h2>${monthlyPayment.toFixed(2)}/mo</h2>
                                            <p>Total Loan Cost: ${totalLoanCost.toFixed(2)}</p>
                                            <p>Total Interest: ${totalInterest.toFixed(2)}</p>
                                        </div>
                                    </Card>
                                </TabPanel>
                            </Tabs>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default VehicleDetails;
