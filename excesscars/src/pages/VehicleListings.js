import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Button, Input, Card, CardBody, CardText, CardTitle, CardSubtitle, CardImgOverlay, Row, Col, Container
} from 'reactstrap';
import { Link } from 'react-router';
import { FaLocationDot } from "react-icons/fa6";
import { IoSpeedometer } from "react-icons/io5";
import SendOffer from '../components/OfferModal';


const VehcileListings = (props) => {
  const [sendOfferModal, setSendOfferModal] = useState(false)
  const [offer, setOffer] = useState(0)
  const closeSendOffer = () => setSendOfferModal(!sendOfferModal)
  let htmlarray = []
  const [isopen, setIsopen] = useState(false);
  const [vehicles, setVehicles] = useState([])
  const [selectedVin, setSelectedVin] = useState()
  const [makes, setMakes] = useState([])
  const [makeshtml, setMakeshtml] = useState([])
  const [htmlstatearray, setHtmlstatearray] = useState([])
  useEffect(() => {
    axios.get('https://excesscarsapi.onrender.com/getAllVehicles/')
      .then(function (response) {
        // handle success
        setVehicles(response.data)
      })
    axios.get('https://excesscarsapi.onrender.com/getMakes/').then(function (response) {
        // handle success
        setMakes(response.data)
      })

  }, [])

  useEffect(()=>{
    let tempArr = []
    for(let i = 0; i < makes.length; i++){
      tempArr.push(<DropdownItem onClick={(e)=>filter(e.target.textContent)}>{makes[i][0]}</DropdownItem>)
    }
    setMakeshtml(tempArr)
  },[makes])

  useEffect(() => {
    console.log(vehicles)
    for (let i = 0; i < vehicles.length; i++) {
      let exteriorcolor = vehicles[i][7]
      let interiorcolor = vehicles[i][8]
      let dealerPrice = vehicles[i][5].slice(0, vehicles[i][5].length - 3) + "," + vehicles[i][5].slice(vehicles[i][5].length - 3)
      let tempSavings = (parseInt(vehicles[i][5]) - parseInt(vehicles[i][5] * .90)).toString()
      let savings = tempSavings.length > 3 ? tempSavings.toString().slice(0, tempSavings.length - 3) + "," + tempSavings.toString().slice(tempSavings.length - 3) : tempSavings
      let youPay = (parseInt(vehicles[i][5] * .90)).toString().slice(0, (parseInt(vehicles[i][5] * .90)).toString().length - 3) + "," + (parseInt(vehicles[i][5] * .90)).toString().slice((parseInt(vehicles[i][5] * .90)).toString().length - 3)
      let tempHtml = <Col lg={4} md={6} sm={12}>
        <Card
          style={{
            width: '100%', margin: "auto", marginTop: "20px"
          }}
        >
          <Link to={'/vehicle/' + vehicles[i][6]}><img
            width={"100%"}
            style={{height:'28vh'}}
            alt="Sample"
            src={vehicles[i][16].replace('{', '').replace('}', '').split(',')[0]}
          /></Link>
          <CardBody>
            <CardTitle tag="h5">
              {vehicles[i][4]} {vehicles[i][2]} {vehicles[i][3]}
            </CardTitle>
            <CardSubtitle
              className="mb-2 text-muted"
              tag="h6"
            >
              <Row>
                <Col lg={12} sm={12}>{vehicles[i][18]}</Col><Col lg={12} sm={12} className='text-end' style={{ color:'black', fontSize: "14px", fontWeight:'bold' }}><IoSpeedometer style={{marginTop:'-4px'}}/> {vehicles[i][12].slice(0, vehicles[i][12].length - 3) + "," + vehicles[i][12].slice(vehicles[i][12].length - 3)} miles</Col>
              </Row>
              <Row className='mt-2' style={{ fontSize: "12px" }}>
                <Col lg={2} sm={2} xs={2}>{exteriorcolor}<br/><div className='small-circle mt-1 ms-1' style={{backgroundColor:exteriorcolor, border:'1px solid black'}}></div></Col>
                <Col lg={2} sm={2} xs={2}>{interiorcolor}<br/><div className='small-circle mt-1 ms-1' style={{backgroundColor:interiorcolor, border:'1px solid black', display:'flex', justifyContent:'center'}}></div></Col>
                <Col lg = {8} sm={8} xs={8} style={{fontWeight:'bold'}} className='text-end'><FaLocationDot style={{marginTop:'-4px'}}/> {vehicles[i][25]}</Col>
              </Row>

            </CardSubtitle>
            <CardText>
              <Row>
                <Col lg={6} md={6} sm={3} xs={6}>Dealer Price <br /> <h4 style={{ fontWeight: "bolder" }}>${dealerPrice}</h4></Col>
                <Col style={{ textAlign: "end" }} lg={6} md={6} sm={6} xs={6}>Potiential Savings <br /> <h4 className='text-success' style={{ fontWeight: "bolder"}}>${savings}</h4></Col>
              </Row>
            </CardText>
            <Row>
              <Col lg={8} sm={8} xs={8}>
                <Input id='offer' onChange={(e) => setOffer(e.target.value)} placeholder={"Suggested Offer $" + youPay}></Input>
              </Col>
              <Col lg={4} sm={4} xs={4}>
                  <Button color='primary' onClick={()=>{setSendOfferModal(true); setSelectedVin(vehicles[i][6]);}}>
                    Send Offer
                  </Button>
              </Col>
            </Row>

          </CardBody>
        </Card>
      </Col>
      htmlarray.push(tempHtml)
    }
    setHtmlstatearray(htmlarray)

    console.log(vehicles)

  }, [vehicles])


  const filter = (make) => {
    axios.get('https://excesscarsapi.onrender.com/getFilteredVehicles/?make=' + make).then((result)=>{
      setVehicles(result.data)
    })
  }


  const toggle = () => setIsopen(!isopen)
  return (<>
    <Container fluid>
      <SendOffer thevin={selectedVin} theoffer={offer} isopen = {sendOfferModal} close = {closeSendOffer} />
      <Row>
        <Col lg={3} md={3} sm={12}>
          <div style={{ width: "100%", height: "100vh", backgroundColor: "red" }}>
            <Dropdown isOpen={isopen} toggle={toggle}>
        <DropdownToggle caret style={{minWidth:"100%"}}>Make</DropdownToggle>
        <DropdownMenu style={{textAlign:"center", minWidth:"100%"}}>
          {makeshtml}
        </DropdownMenu>
      </Dropdown>
          </div>
        </Col>
        <Col lg={8} md={9} sm={12}>
          <Row style={{ alignItems: "center  " }}>
            {htmlstatearray}
          </Row>
        </Col>
      </Row>
    </Container>



  </>)


}

export default VehcileListings;