import "../style/components/contact.scss";
import {Row, Col} from 'react-bootstrap';

const LocationMap = ({ }) => {

  return (
    <Row className="map-container mb-5 rounded-xl">
        <Col className="rounded-xl">
          <iframe
            className="rounded-xl"
            title="Company Location"
            src="https://maps.google.com/maps?q=Mertko+Plastik+Ürünleri+San.Tic.Ltd.Şti.&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Col>
      </Row>
  )
}

export default LocationMap;