import {Row, Col} from 'react-bootstrap';
import "../style/components/contact.scss";

const LocationMap = ({ }) => {

  return (
    <Row className="map-container mb-5 rounded-xl">
        <Col className="rounded-xl">
          <iframe
            className="rounded-xl"
            title="Company Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10124.788008225956!2d28.912459653945987!3d41.02268556267862!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab57c7afabc51%3A0x24b97f98d9ddef60!2sMertko%20Plastik%20%C3%9Cr%C3%BCnleri!5e0!3m2!1sen!2str!4v1741735420788!5m2!1sen!2str"
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