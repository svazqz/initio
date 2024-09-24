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
            Create your API documentation automatically (currently only in
            vercel)
          </h1>
          <p className="text-[16px] lg:text-[18px] text-white mb-6">
            To achieve this you need to configure your application in vercel as
            follow:
            <br />
            <p>Build command:</p>
            <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
              <span className="flex gap-4">
                <span className="flex-1">
                  <span>pnpm run next-base:build:prod</span>
                </span>
              </span>
            </code>
            <p>Output directory</p>
            <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
              <span className="flex gap-4">
                <span className="flex-1">
                  <span>dist/apps/next-base/.next</span>
                </span>
              </span>
            </code>
            <p>Install command</p>
            <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
              <span className="flex gap-4">
                <span className="flex-1">
                  <span>pnpm install --frozen-lockfile</span>
                </span>
              </span>
            </code>
          </p>
          <br />
          This will create the OpenAPI JSON automatically (as shown in the code
          block) and the documentation can be accessed either from{' '}
          <a
            href="/api/docs"
            target="_blank"
            className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="w-full">/api/docs</span>
            <svg
              className="w-4 h-4 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          in JSON format or using the SwaggerUI accessing to{' '}
          <a
            href="docs"
            target="_blank"
            className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="w-full">/docs</span>
            <svg
              className="w-4 h-4 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
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
        "requestBody": {
          "description": "Body",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "latitude": {
                    "type": "number"
                  },
                  "longitude": {
                    "type": "number"
                  }
                },
                "required": [
                  "latitude",
                  "longitude"
                ]
              }
            }
          }
        },
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
