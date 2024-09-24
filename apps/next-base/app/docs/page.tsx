import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// eslint-disable-next-line react/display-name
export default function Docs() {
  return <SwaggerUI url="/api/docs" />;
}
