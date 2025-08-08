import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Input, Card, CardBody, CardText, CardTitle, CardSubtitle, CardImgOverlay, Row, Col, Container } from 'reactstrap';

const VehcileListings = (props) => {
  let htmlarray = []
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([])
  const [htmlstatearray, setHtmlstatearray] = useState([])
  useEffect(() => {
    axios.get('https://excesscarsapi.onrender.com/getAllVehicles/')
      .then(function (response) {
        // handle success
        setVehicles(response.data)
      })

  }, [])
  useEffect(() => {
    console.log(vehicles)
    for (let i = 0; i < vehicles.length; i++) {
      let tempHtml = <Col lg={4} md={6} sm={12}>
        <Card 
          style={{
            width: '100%', margin:"auto", marginTop:"20px"
          }}
        >
          <img
            width={"100%"}
            alt="Sample"
            src={vehicles[i][16].replace('{', '').replace('}', '').split(',')[0]}
          />
          <CardBody>
            <CardTitle tag="h5">
              {vehicles[i][4]} {vehicles[i][2]} {vehicles[i][3]}
            </CardTitle>
            <CardSubtitle
              className="mb-2 text-muted"
              tag="h6"
            >
              <Row>
                <Col lg={12} sm={12}>{vehicles[i][18]}</Col><Col lg={12} sm={12} className='text-end' style={{fontSize:"12px"}}>{vehicles[i][12]} miles</Col>
              </Row>
              
            </CardSubtitle>
            <CardText>
              <Row>
                <Col lg={6} md={6} sm={3} xs={6}>Dealer Price <br/> <h4 style={{fontWeight:"bolder"}}>${vehicles[i][5]}</h4></Col>
                <Col style={{textAlign:"end"}} lg={6} md={6} sm={6} xs={6}>Potiential Savings <br/> <h4 style={{fontWeight:"bolder", color:"green"}}>${(parseInt(vehicles[i][5]) - parseInt(vehicles[i][5] * .90)).toString()}</h4></Col>
              </Row>
            </CardText>
            <Row>
              <Col lg={8} sm={8} xs={8}>
              <Input placeholder={"Suggested Offer $" + (parseInt(vehicles[i][5] * .90)).toString()}></Input>
              </Col>
              <Col lg={4} sm={4} xs={4}>
              <Button color='primary'>
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


  return (<>
  <Container fluid> 
<Row>
    <Col lg={3} md={3} sm={12}>
    <div style={{width:"100%", height:"100vh", backgroundColor:"red"}}></div>
    </Col>
    <Col lg={8} md={9} sm={12}>
    <Row style={{alignItems:"center  "}}>
      {htmlstatearray}
    </Row>
    </Col>
  </Row>
  </Container>
  
    

  </>)


}

export default VehcileListings;