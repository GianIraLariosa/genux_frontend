import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import backgroundIMG from "../assets/images/bg/seaside2.jpg";
import Accordion from "./Accordion";

const FAQ = () => {

    return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
                {/* Single CardBody for FAQ Questions */}
                <Card className="w-80" style={{ marginTop: '4em' , marginBottom: '4px'}}>
                <CardBody className="card-body p-5" style={{display: 'flex', flexDirection: 'column'}}>
                    <CardTitle className="card-title text-center mb-5">
                    <h2 style={{ marginTop: '20px' }}>Frequently Asked Questions</h2>
                    </CardTitle>
                        {/* Back Button */}
                        <button 
                        onClick={() => window.history.back()}  // Use this to go back to the previous page
                        style={{
                            position: 'absolute', 
                            top: '10px', 
                            left: '10px', 
                            background: 'transparent', 
                            border: 'none', 
                            color: '#007bff', 
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                        >
                        ← Back
                        </button>
                    <Accordion/>
                </CardBody>
                </Card>
         </div>
    );
}

export default FAQ;