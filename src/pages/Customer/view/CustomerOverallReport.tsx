import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
}

const CustomerOverallReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
  if (!data) return null;

  const { customer, general, emiSchedule } = data;

  const formatCurrency = (amt: number | string | null | undefined) => {
    if (amt === undefined || amt === null || amt === '') return '0.00';
    return Number(amt).toFixed(2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD-MMM-YYYY');
  };

  const marketerName = customer?.cedId?.name || customer?.ddId?.name || general?.project?.introducerName || '';
  const marketerPhone = customer?.cedId?.phone || customer?.ddId?.phone || general?.project?.introducerPhone || '';
  const landCost = (data?.summary?.totalEmiAmountScheduled || 0) + (data?.summary?.totalPaid || 0);

  // Common border style for the cells
  const borderStyle = '1px solid #000';
  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };

  return (
    <Box 
      ref={ref} 
      sx={{ 
        width: '210mm', 
        minHeight: '297mm', // A4 Portrait
        backgroundColor: '#FFFFFF', 
        color: '#000000',
        p: '10mm', 
        boxSizing: 'border-box',
        fontFamily: '"Arial", sans-serif',
        fontSize: '10pt',
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
        },
        '& th, & td': {
          border: '1px solid #000',
          padding: '4px 6px',
        }
      }}
    >
      <table>
        <tbody>
          {/* Row 1: PLOT ESTIMATION */}
          <tr>
            <td colSpan={6} align="center" style={{ fontWeight: 'bold', fontSize: '14pt', padding: '6px' }}>
              PLOT ESTIMATION
            </td>
          </tr>

          {/* Row 2: Customer Details */}
          <tr>
            <td colSpan={6} style={{ padding: 0 }}>
              <table style={tableStyle}>
                <tbody>
                  <tr>
                    <td style={{ width: '60%', border: 'none', verticalAlign: 'top', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <div style={{ width: '70px' }}>Name</div>
                        <div>{customer?.name || ''}#{customer?.customerCode || ''}#{customer?.phone || ''}</div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '70px' }}>Address</div>
                        <div>
                          {customer?.address ? `${customer.address} ` : ''}
                          {customer?.city || ''}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 0
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '40%', border: 'none', verticalAlign: 'top', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <div style={{ width: '60px' }}>Ref.Id</div>
                        <div>{customer?.customerCode || ''}</div>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <div style={{ width: '60px' }}>Phone</div>
                        <div>{customer?.phone || ''}</div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '60px' }}>EMAIL</div>
                        <div style={{ textTransform: 'uppercase' }}>{customer?.email || ''}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 3: Project Info */}
          <tr>
            <td colSpan={6} style={{ padding: 0 }}>
              <table style={tableStyle}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', border: 'none', verticalAlign: 'top', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <div style={{ width: '110px' }}>PROJECT NAME</div>
                        <div style={{ fontWeight: 'bold' }}>{general?.project?.projectName || ''}</div>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <div style={{ width: '110px' }}>Introducer Name :</div>
                        <div>{marketerName}</div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '130px', textAlign: 'left' }}>Mobile :</div>
                        <div>{marketerPhone}</div>
                      </div>
                    </td>
                    <td style={{ width: '20%', border: 'none', verticalAlign: 'bottom', textAlign: 'center', padding: '6px 8px' }}>
                      Area Size &nbsp;&nbsp;&nbsp; 1
                    </td>
                    <td style={{ width: '30%', border: 'none', verticalAlign: 'bottom', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div>Plot No</div>
                        <div>11</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div>Rate per Sqft</div>
                        <div>0.00</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>LAND COST</div>
                        <div>{formatCurrency(landCost)}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* EMI Headers */}
          <tr style={{ fontWeight: 'bold' }}>
            <td align="center">EMI No</td>
            <td align="center">EMI Date</td>
            <td align="center">EMI Amount</td>
            <td align="center">Paid Date</td>
            <td align="center">Paid Amount</td>
            <td align="center">Balance</td>
          </tr>

          {/* EMI Data Rows */}
          {(emiSchedule && emiSchedule.length > 0) ? emiSchedule.map((emi: any, index: number) => {
            const isPaid = emi.status === 'Paid';
            const balanceAmt = isPaid ? 0 : emi.emiAmt;
            return (
              <tr key={index}>
                <td align="center">{emi.emiNo}</td>
                <td align="center">{formatDate(emi.dueDate)}</td>
                <td align="right" style={{ paddingRight: '15px' }}>{formatCurrency(emi.emiAmt)}</td>
                <td align="center">{isPaid ? formatDate(emi.paidDate) : ''}</td>
                <td align="right" style={{ paddingRight: '15px' }}>{isPaid ? formatCurrency(emi.paidAmt) : ''}</td>
                <td align="center">{formatCurrency(balanceAmt)}</td>
              </tr>
            );
          }) : (
             <tr>
               <td colSpan={6} align="center" style={{ padding: '20px' }}>No EMI Schedule Available</td>
             </tr>
          )}

          {/* Fill remaining empty rows if schedule is short (optional visual filler) */}
          {Array.from({ length: Math.max(0, 23 - (emiSchedule?.length || 0)) }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td align="center" style={{ height: '20px' }}>&nbsp;</td>
              <td align="center"></td>
              <td align="center"></td>
              <td align="center"></td>
              <td align="center"></td>
              <td align="center"></td>
            </tr>
          ))}

          {/* Totals Row */}
          <tr>
            <td colSpan={2}></td>
            <td align="right" style={{ paddingRight: '15px' }}>{formatCurrency(data?.summary?.totalEmiAmountScheduled)}</td>
            <td></td>
            <td align="right" style={{ paddingRight: '15px' }}>{formatCurrency(data?.summary?.totalPaid)}</td>
            <td align="center">{formatCurrency(data?.summary?.totalBalance)}</td>
          </tr>

          {/* Footer Branding */}
          <tr>
            <td colSpan={6} style={{ padding: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                  {/* Using a placeholder styled like the Life Housing logo or an img tag if public asset exists */}
                  <img src="/assets/logo/log.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'fill' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <div style={{ flex: 1, fontFamily: '"Times New Roman", Times, serif' }}>
                  <div style={{ fontSize: '14pt', fontWeight: 'bold', fontStyle: 'italic', color: '#000' }}>
                    LIFE HOUSING & PROPERTIES
                  </div>
                  <div style={{ fontSize: '10pt', fontStyle: 'italic', lineHeight: 1.2 }}>
                    NO.107/1,1st FLOOR,AMPA MANOR,NELSON MANICKAM
                    <br />
                    ROAD,AMINJIKARAI,CHENNAI-29
                    <br />
                    Contact : 78240 29123
                  </div>
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </Box>
  );
});

export default CustomerOverallReport;
