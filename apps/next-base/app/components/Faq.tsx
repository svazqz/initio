'use client';
import * as Accordion from '@radix-ui/react-accordion';
import PlusIcon from '../../public/assets/Plus.svg';
import Image from 'next/image';
import Minus from '../../public/assets/Minus.svg';
import { useState } from 'react';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

const Faq = () => {
  const [value, setValue] = useState('item-1');

  const handleTrigger = (item: any) => {
    const itemVal = `item-${item}`;
    if (itemVal === value) {
      setValue('');
    } else {
      setValue(itemVal);
    }
  };

  return (
    <div
      className="px-5 lg:px-0 lg:container pt-14 sm:pt-32 text-white"
      id="faq"
    >
      <div className="flex flex-col lg:flex-row lg:gap-x-6">
        <div className="lg:w-1/3">
          <p className="text-[#EB2891] font-medium text-[14px] lg:text[16px] my-4">
            OpenAPI Out of the Box
          </p>
          <h1 className="text-medium text-info text-[24px] lg:text-[42px] mb-4">
            Create your API documentation by running a single command
          </h1>
          <p className="text-[16px] lg:text-[18px] text-white mb-6">
            Once you have registered your API definitions in the lib data you
            can simple run the command 'nx run lib-data:exporter' and you'll get
            the JSON definition for your API.
          </p>
        </div>
        <div className="lg:w-2/3">
          <AceEditor
            mode="javascript"
            theme="twilight"
            readOnly
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            height="900px"
            width="800px"
            value={`{
  "info": {
    "title": "",
    "version": "1"
  },
  "openapi": "3.0",
  "components": {
    "schemas": {
      "Response": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string"
          },
          "state": {
            "type": "string"
          },
          "country": {
            "type": "string"
          }
        },
        "required": [
          "city",
          "state",
          "country"
        ]
      }
    },
    "parameters": {}
  },
  "paths": {
    "/geo": {
      "get": {
        "summary": "",
        "parameters": [
          {
            "schema": {
              "type": "number"
            },
            "required": true,
            "name": "latitude",
            "in": "query"
          },
          {
            "schema": {
              "type": "number"
            },
            "required": true,
            "name": "longitude",
            "in": "query"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Response"
                }
              }
            }
          }
        }
      },
      "POST": {
        "summary": "",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Response"
                }
              }
            }
          }
        }
      }
    }
  }
}`}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Faq;
