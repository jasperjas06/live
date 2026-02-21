import { forwardRef } from "react";
import { calculateEmiSummary } from "src/utils/billCalculation.utils";

interface BillProps {
  data: any;
  logo?: string;
}

const numberToWords = (num: number): string => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if ((num = num.toString() as any).length > 9) return "overflow";
  const n: any = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return "";
  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str.trim();
};

const BillView = forwardRef<HTMLDivElement, { data: any }>(
  ({ data }, billRef) => {
    // const {
    //   totalAmount,
    //   previousPaidAmount,
    //   currentPaidAmount,
    //   balanceAmount,
    // } = calculateEmiSummary(data);

    const totalAmount = data.billData?.totalAmount;
    const previousPaidAmount = data.billData?.totalPreviouslyPaid;
    const currentPaidAmount =
      data.billData?.totalPaid - data.billData?.totalPreviouslyPaid;
    const balanceAmount = data.billData?.totalunPaid;

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
              paddingBottom: "5px",
            }}
          >
            <img
              src={"/assets/logo/log.jpg"}
              alt="logo"
              style={{
                width: "80px",
                height: "100%",
                alignSelf: "center",
                marginRight: "10px",
                marginLeft: "10px",
              }}
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
                    fontWeight: "900",
                  }}
                >
                  LIFE HOUSING ENTERPRISES
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
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}
                >
                  <p
                    style={{
                      width: "30%",
                      margin: " 0",
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "flex-end",
                      fontWeight: "900",
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
                    {data?.id || data?._id
                      ? String(data?.id || data?._id).slice(0, 5)
                      : ""}
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}
                >
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
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}
                >
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
            <h2
              style={{
                width: "100%",
                fontSize: "12px",
                fontWeight: "bold",
                margin: "6px",
              }}
            >
              RECEIPT
            </h2>
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
                    padding: "3px",
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
                    padding: "3px 0px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "65%",
                    padding: "3px 0",
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
                    padding: "3px",
                    justifyContent: "flex-start",
                  }}
                >
                  Customer ID
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: "2px 0",
                    padding: "3px 0px",
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
                    padding: "3px 0",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.customer?.id ||
                    data?.customerCode ||
                    data?.customer?._id ||
                    "N/A"}
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
                    margin: "2px 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "3px",
                    justifyContent: "flex-start",
                  }}
                >
                  Mobile
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    padding: "3px 0px",
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
                    padding: "3px 0",
                    fontSize: "12px",
                    margin: "2px 0",
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
              <div style={{ width: "100%", display: "flex", fontSize: "12px" }}>
                <p
                  style={{
                    width: "40%",
                    padding: "3px",
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "2px 0",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Sponsor ID
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: "2px 0",
                    fontSize: "12px",
                    padding: "3px 0px",
                    textAlign: "center",
                  }}
                >
                  :
                </p>
                <p
                  style={{
                    textAlign: "start",
                    width: "55%",
                    padding: "3px 0",
                    margin: "2px 0",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data?.introducer?._id
                    ? String(data.introducer._id).slice(0, 5)
                    : data?.customer?.ddId?.id ||
                      data?.customer?.cedId?.id ||
                      "N/A"}
                </p>
              </div>
              {data.customer?.cedId && (
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
                  <p
                    style={{
                      width: "40%",
                      padding: "3px",
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: "2px 0",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    CHIEF EXECUTIVE DIRECTOR
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: "2px 0",
                      padding: "3px 0px",
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
                      padding: "3px 0",
                      fontSize: "12px",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {`${data.customer.cedId?.name}  / ${data.customer.cedId?.phone}`}
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
                    margin: "2px 0",
                    fontSize: "12px",
                    textAlign: "center",
                    display: "flex",
                    padding: "3px",
                    justifyContent: "flex-end",
                  }}
                >
                  Diamond Director
                </p>
                <p
                  style={{
                    width: "5%",
                    margin: 0,
                    padding: "3px 0px",
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
                    padding: "3px 0px",
                    fontSize: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {data.customer?.ddId?.name && data.customer?.ddId?.phone
                    ? `${data.customer.ddId.name}  / ${data.customer.ddId.phone}`
                    : data.introducer?.name && data.introducer?.phone
                      ? `${data.introducer.name}  / ${data.introducer.phone}`
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
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
                  <p
                    style={{
                      width: "40%",
                      margin: "2px 0",
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      padding: "3px",
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
                      padding: "3px 0px",
                      textAlign: "center",
                    }}
                  >
                    :
                  </p>
                  <p
                    style={{
                      textAlign: "start",
                      width: "60%",
                      padding: "3px 0",
                      margin: "2px 0",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {data?.general?.project?.projectName || "-"}
                  </p>
                </div>
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
                  <p
                    style={{
                      width: "40%",
                      margin: 0,
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      padding: "3px",
                      justifyContent: "flex-start",
                    }}
                  >
                    Inst No :
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: "2px 0",
                      padding: "3px 0px",
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
                      padding: "3px 0",
                      fontSize: "12px",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {data?.emiNo}
                  </p>
                </div>
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
                  <p
                    style={{
                      width: "40%",
                      margin: 0,
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      padding: "3px",
                      justifyContent: "flex-start",
                    }}
                  >
                    Inst Date :
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: "2px 0",
                      padding: "3px 0px",
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
                      padding: "3px 0",
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
                      margin: "2px 0",
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      padding: "3px",
                      justifyContent: "flex-start",
                    }}
                  >
                    Remarks
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: 0,
                      padding: "3px 0px",
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
                      padding: "3px 0",
                      fontSize: "12px",
                      margin: "2px 0",
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
                      margin: "2px 0",
                      fontSize: "12px",
                      textAlign: "center",
                      display: "flex",
                      padding: "3px",
                      justifyContent: "flex-start",
                    }}
                  >
                    Received
                  </p>
                  <p
                    style={{
                      width: "5%",
                      margin: 0,
                      padding: "3px 0px",
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
                      padding: "3px 0",
                      fontSize: "12px",
                      margin: "2px 0",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      fontWeight: "bold",
                    }}
                  >
                    {data?.amountPaid
                      ? ` ${numberToWords(data.amountPaid)} only`
                      : "N/A"}
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
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
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
                    {/* {data?.general?.emiAmount *
                      data?.general?.noOfInstallments || "N/A"} */}
                    {totalAmount}
                  </p>
                </div>
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
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
                    {/* {(data?.general?.emiAmount * data?.general?.noOfInstallments) - data?.balanceAmount} */}
                    {previousPaidAmount}
                  </p>
                </div>
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
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
                    {/* {data?.amountPaid || "N/A"} */}
                    {currentPaidAmount}
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
                <div
                  style={{ width: "100%", display: "flex", fontSize: "12px" }}
                >
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
                    {/* {data?.balanceAmount || "N/A"} */}
                    {balanceAmount}
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
                {data?.createdBy?.name && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p
                      style={{
                        display: "flex",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        color: "#000",
                        fontWeight: "500",
                        fontSize: "12px",
                        marginTop: "10px",
                        marginBottom: "2px",
                      }}
                    >
                      Created By {data.createdBy.name}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        color: "#000",
                        fontWeight: "500",
                        fontSize: "12px",
                        marginTop: "0px",
                      }}
                    >
                      Created At{" "}
                      {data?.createdAt
                        ? new Date(data.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                )}
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
                    LIFE HOUSING ENTERPRISES
                  </span>
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: "10px",
                margin: "4px 0",
                marginBottom: "0",
                marginLeft: "480px",
                marginTop: "5px",
                fontWeight: "300",
              }}
            >
              Computerized bill signature not required
            </p>
            <h1
              style={{
                fontWeight: "700",
                margin: "10px 16px 16px 16px",
                fontSize: "20px",
              }}
            >
              Come with us Grow with us
            </h1>
            {/* <p style={{ fontSize: "8px", margin: "0 16px", marginTop: "-8px", marginBottom: "16px", color: "#666" }}>
              This is a system generated invoice.
            </p> */}
          </div>
        </div>
      </div>
    );
  }
);

export default BillView;
