'use client';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';

const Swagger = () => {
  return (
    <div className="absolute w-full h-full bg-white overflow-y-scroll">
      <SwaggerUI url="/api/docs" />
    </div>
  );
};

export default Swagger;
