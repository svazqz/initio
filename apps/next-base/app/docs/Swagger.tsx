'use client';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';

const Swagger = () => {
  return (
    <>
      <SwaggerUI url="/api/docs" />
    </>
  );
};

export default Swagger;
