import React, { forwardRef, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../public/assets/logo/log.jpg"

interface BillProps {
  data: any;
  logo?: string; 
}

const BillView = forwardRef<HTMLDivElement, { data: any }>(({ data }, billRef) => {
console.log(billRef)
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
         position: "absolute",
        left: "-99999px",
        top: "-99999px",
        flexDirection: "column",
      }}
    >
      <div
        ref={billRef}
        style={{
          width: "calc(100% - 32px)",
          height: "768px",
          position: "relative",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          margin: "32px",
          border: "2px solid black",
          // borderBottom: "2px solid black",
          maxWidth: "770px",
        //   fontFamily: "Times New Roman, Times, serif",
        }}
      >
        <div
          style={{
            borderBottom: "2px solid black",
            display: "flex",
            width: "calc(100% - 32px)",
            // width: "100%",
            minHeight: "90px",
            height: "auto",
            margin: "16px",
            border: "2px solid black",
            marginBottom: 0,
          }}
        >
          <img
            src={"../../../public/assets/logo/log.jpg"}
            alt="logo"
            style={{ width: "80px", height: "100%", alignSelf: "center", marginRight:"10px" }}
          />
          <div style={{ display: "flex", width: "calc(100% - 0px)" }}>
            <div
              style={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
              }}
            >
              <h1
                style={{
                  fontSize: "14px",
                  margin: "5px 0",
                  textAlign: "start",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                   fontWeight:"bold"
                }}
              >
                LIFE ALLIANCE ENTERPRISES
              </h1>
              <p
                style={{
                  textAlign: "start",
                  margin: "4px 0",
                  marginTop: "5px",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                NO.107/1,1st FLOOR,AMPA MANOR,NELSON MANICKAM
                ROAD,AMINJIKARAI,CHENNAI-29
              </p>
              <p
                style={{
                  textAlign: "start",
                  margin: "5px 0",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                Contact No: - 78240 29123
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "45%",
              }}
            >
              <div style={{ width: "100%", display: "flex", fontSize: "12px", margin:"5px 0" }}>
                <p
                  style={{
                    width: "30%",
                    margin: " 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Receipt No
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "65%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-start",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                   {data?.id || data?._id}
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px", margin:"5px 0"  }}>
                <p
                  style={{
                    width: "30%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Payment Date
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-start",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {new Date(data.paymentDate).toLocaleDateString()}
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px", margin:"5px 0" }}>
                <p
                  style={{
                    width: "30%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  M.O.P
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "65%",
                    margin: 0,
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data.modeOfPayment}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "calc(100% - 32px)",
            margin: "0 16px",
            border: "2px solid black",
            borderTop: 0,
          }}
        >
          <h2 style={{ width: "100%", fontSize: "12px", fontWeight:"bold", margin:"12px" }}>RECEIPT</h2>
        </div>
        <div
          style={{
            display: "flex",
            width: "calc(100% - 32px)",
            margin: "0 16px",
            marginTop: 0,
            border: "2px solid black",
            borderTop: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "40%",
            }}
          >
            <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
              <p
                style={{
                  width: "40%",
                  margin: "2px 0",
                  fontSize: "12px",
                  textAlign: "center",
                  display: "flex",
                  padding: "5px",
                  justifyContent: "flex-start",
                }}
              >
                Customer Name
              </p>
              <p
                style={{
                  width: "5%",
                  margin: "2px 0",
                  fontSize: "12px",
                  padding: "5px 0px",
                  textAlign: "center",
                }}
              >
                :
              </p>
              <p
                style={{
                  textAlign: "start",
                  width: "65%",
                  padding: "5px 0",
                  margin: "2px 0",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {data?.customer?.name || "N/A"}
              </p>
            </div>
            <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
              <p
                style={{
                  width: "40%",
                  margin: 0,
                  fontSize: "12px",
                  textAlign: "center",
                  display: "flex",
                  padding: "5px",
                  justifyContent: "flex-start",
                }}
              >
                Customer ID
              </p>
              <p
                style={{
                  width: "5%",
                  margin: "2px 0",
                  padding: "5px 0px",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                :
              </p>
              <p
                style={{
                  textAlign: "start",
                  width: "65%",
                  margin: "2px 0",
                  padding: "5px 0",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                    {data?.customer?.id || data?.customerCode || data?.customer?._id || "N/A"}
              </p>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                fontSize: "12px",
              }}
            >
              <p
                style={{
                  width: "40%",
                  margin: "3px 0",
                  fontSize: "12px",
                  textAlign: "center",
                  display: "flex",
                  padding: "5px",
                  justifyContent: "flex-start",
                }}
              >
                Mobile
              </p>
              <p
                style={{
                  width: "5%",
                  margin: 0,
                  padding: "5px 0px",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                :
              </p>
              <p
                style={{
                  textAlign: "start",
                  width: "65%",
                  padding: "5px 0",
                  fontSize: "12px",
                  margin: "3px 0",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {data?.customer?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              width: "60%",
            }}
          >
          {data.cedId && (
                <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                  <p
                    style={{
                      width: "40%",
                      padding: "5px",
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: "2px 0",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    EXECUTIVE
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: "2px 0",
                      padding: "5px 0px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    :
                  </p>
                  <p
                    style={{
                      textAlign: "start",
                      width: "55%",
                      margin: "2px 0",
                      padding: "5px 0",
                      fontSize: "12px",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {`${data.cedId?.name}  / ${data.cedId?.phone}`}
                  </p>
                </div>
              )}
            <div
              style={{
                width: "100%",
                display: "flex",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              <p
                style={{
                  width: "40%",
                  margin: "3px 0",
                  fontSize: "12px",
                  textAlign: "center",
                  display: "flex",
                  padding: "5px",
                  justifyContent: "flex-end",
                }}
              >
                Diamond Director
              </p>
              <p
                style={{
                  width: "5%",
                  margin: 0,
                  padding: "5px 0px",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                :
              </p>
              <p
                style={{
                  textAlign: "start",
                  width: "55%",
                  margin: "3px 0",
                  padding: "5px 0px",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
               {(data.introducer?.name && data.introducer?.phone) 
                    ? `${data.introducer.name}  / ${data.introducer.phone}` 
                    : (data.ddId?.name && data.ddId?.phone)
                    ? `${data.ddId.name}  / ${data.ddId.phone}`
                    : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "calc(100% - 32px)",
            margin: "0 16px",
            marginTop: 0,
            border: "2px solid black",
            borderTop: 0,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                width: "40%",
              }}
            >
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                  width: "40%",
                    margin: "2px 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "5px",
                    justifyContent: "flex-start",
                  }}
                >
                  Project Name
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: "2px 0",
                    fontSize: "12px",
                    padding: "5px 0px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    padding: "5px 0",
                    margin: "2px 0",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  LIFE SAVINGS SCHEME
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                  width: "40%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "5px",
                    justifyContent: "flex-start",
                  }}
                >
                  Inst No :
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: "2px 0",
                    padding: "5px 0px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    margin: "2px 0",
                    padding: "5px 0",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.emiNo}
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                  width: "40%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "5px",
                    justifyContent: "flex-start",
                  }}
                >
                  Inst Date :
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: "2px 0",
                    padding: "5px 0px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    margin: "2px 0",
                    padding: "5px 0",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {new Date(data.paymentDate).toLocaleDateString() || "N/A"}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  fontSize: "12px",
                }}
              >
                <p
                  style={{
                  width: "40%",
                    margin: "3px 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "5px",
                    justifyContent: "flex-start",
                  }}
                >
                  Remarks
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    padding: "5px 0px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    padding: "5px 0",
                    fontSize: "12px",
                    margin: "3px 0",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.remarks || "N/A"}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  fontSize: "12px",
                }}
              >
                <p
                  style={{
                  width: "40%",
                    margin: "3px 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "5px",
                    justifyContent: "flex-start",
                  }}
                >
                  Received
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    padding: "5px 0px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "60%",
                    padding: "5px 0",
                    fontSize: "12px",
                    margin: "3px 0",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.amountPaid || "N/A"}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                width: "calc(60% - 100px)",
                paddingLeft: "100px",
              }}
            >
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                    width: "55%",
                    margin: " 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Total Value
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "45%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.general?.emiAmount * data?.general?.noOfInstallments ||
                    "N/A"}
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                    width: "55%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Prv. Paid Amount
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "45%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  0
                </p>
              </div>
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                    width: "55%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Current Paid Amount
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "45%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.amountPaid || "N/A"}
                </p>
              </div>
              <span
                style={{
                  width: "100px",
                  border: "1px solid black",
                  height: 0,
                  marginRight: "10px",
                  alignSelf: "end",
                }}
              ></span>
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                    width: "55%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Balance
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "45%",
                    margin: 0,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.balanceAmount || "N/A"}
                </p>
              </div>
              <span
                style={{
                  width: "100px",
                  border: "1px solid black",
                  height: 0,
                  marginRight: "10px",
                  alignSelf: "end",
                }}
              ></span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 10px",
                paddingLeft: "5px",
              }}
            >
              <p
                style={{
                  display: "flex",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                Created By AARTHI
              </p>
              <p
                style={{
                  display: "flex",
                  width: "auto",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                for{" "}
                <span style={{ fontWeight: "600", paddingLeft: "5px" }}>
                  {" "}
                  LIFE ALLIANCE Created By AARTHI ENTERPRISES
                </span>
              </p>
            </div>
          </div>
          <h1 style={{ fontWeight: "700", margin: "16px", fontSize: "20px" }}>
            Come with us Grow with us
          </h1>
        </div>
      </div>
    </div>
  );
});

export default BillView;
