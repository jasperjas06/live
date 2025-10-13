import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { Box, Card, Grid, Chip, Backdrop, Typography, CardContent, CircularProgress, Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

import { getANVT } from 'src/utils/api.service'

import { DashboardContent } from 'src/layouts/dashboard'

const ViewNVT = () => {
    const {id} = useParams()
    const [data,setData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    
    const getData = async() =>{
        try {
            setLoading(true)
            const response = await getANVT(id)
            if(response.status){
                setData(response.data.data)
            }
        } catch (error) {
           console.log(error) 
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        if(id) getData()
    },[id])

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount)

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

    const downloadAsExcel = () => {
        // Create workbook structure
        const worksheetData: any[][] = []
        
        // Add title
        worksheetData.push(['NVT Details Report'])
        worksheetData.push([])
        
        // Customer Information Section
        worksheetData.push(['CUSTOMER INFORMATION'])
        worksheetData.push(['Customer Name', data.customer?.name || 'N/A'])
        worksheetData.push(['Phone Number', data.customer?.phone || 'N/A'])
        worksheetData.push(['Email', data.customer?.email || 'N/A'])
        worksheetData.push(['Marketer Name', data.customer?.marketerName || 'N/A'])
        worksheetData.push(['Address', data.customer?.address || 'N/A'])
        worksheetData.push(['City', data.customer?.city || 'N/A'])
        worksheetData.push(['State', data.customer?.state || 'N/A'])
        worksheetData.push(['Pincode', data.customer?.pincode || 'N/A'])
        worksheetData.push([])
        
        // NVT Information Section
        worksheetData.push(['NVT INFORMATION'])
        worksheetData.push(['Introducer Name', data.introducerName || 'N/A'])
        worksheetData.push(['Total Payment', formatCurrency(data.totalPayment || 0)])
        worksheetData.push(['Initial Payment', formatCurrency(data.initialPayment || 0)])
        worksheetData.push(['EMI Amount', formatCurrency(data.emi || 0)])
        worksheetData.push(['Conversion', data.conversion ? 'Yes' : 'No'])
        worksheetData.push(['MOD Required', data.needMod ? 'Yes' : 'No'])
        worksheetData.push(['Created Date', data.createdAt ? formatDate(data.createdAt) : 'N/A'])
        worksheetData.push(['Last Updated', data.updatedAt ? formatDate(data.updatedAt) : 'N/A'])
        
        // MOD Details Section (if applicable)
        if (data.needMod && data.mod) {
            worksheetData.push([])
            worksheetData.push(['MOD DETAILS'])
            worksheetData.push(['Date', data.mod.date ? formatDate(data.mod.date) : 'N/A'])
            worksheetData.push(['Site Name', data.mod.siteName || 'N/A'])
            worksheetData.push(['Plot Number', data.mod.plotNo || 'N/A'])
            worksheetData.push(['Status', data.mod.status || 'N/A'])
            worksheetData.push(['Introducer Name', data.mod.introducerName || 'N/A'])
            worksheetData.push(['Introducer Phone', data.mod.introducerPhone || 'N/A'])
            worksheetData.push(['Director Name', data.mod.directorName || 'N/A'])
            worksheetData.push(['Director Phone', data.mod.directorPhone || 'N/A'])
            worksheetData.push(['ED Name', data.mod.EDName || 'N/A'])
            worksheetData.push(['ED Phone', data.mod.EDPhone || 'N/A'])
            worksheetData.push(['Amount', formatCurrency(data.mod.amount || 0)])
        }
        
        // Convert to CSV format
        const csvContent = worksheetData.map(row => 
            row.map(cell => {
                const cellStr = String(cell || '')
                // Escape quotes and wrap in quotes if contains comma, quote, or newline
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`
                }
                return cellStr
            }).join(',')
        ).join('\n')
        
        // Create blob and download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `NVT_Details_${data.customer?.name || 'Report'}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <DashboardContent maxWidth="xl">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </DashboardContent>
        )
    }

    return (
        <DashboardContent maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={600}>
                    NVT Details
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadAsExcel}
                >
                    Download as Excel
                </Button>
            </Box>

            {/* Customer Information */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                        Customer Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Customer Name
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.name || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Phone Number
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.phone || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Email
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.email || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Marketer Name
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.marketerName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Address
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.address || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    City
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.city || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    State & Pincode
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.customer?.state || 'N/A'} - {data.customer?.pincode || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* NVT Information */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                        NVT Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Introducer Name
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.introducerName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Total Payment
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                                    {formatCurrency(data.totalPayment || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Initial Payment
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'info.main' }}>
                                    {formatCurrency(data.initialPayment || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    EMI Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'warning.main' }}>
                                    {formatCurrency(data.emi || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Conversion
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip 
                                        label={data.conversion ? 'Yes' : 'No'} 
                                        color={data.conversion ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    MOD Required
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip 
                                        label={data.needMod ? 'Yes' : 'No'} 
                                        color={data.needMod ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Created Date
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.createdAt ? formatDate(data.createdAt) : 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Last Updated
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.updatedAt ? formatDate(data.updatedAt) : 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* MOD Information - Only show if MOD exists */}
            {data.needMod && data.mod && (
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                            MOD Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.date ? formatDate(data.mod.date) : 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Site Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.siteName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Plot Number
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.plotNo || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Status
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip 
                                            label={data.mod.status} 
                                            color={data.mod.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Introducer Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.introducerName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Introducer Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.introducerPhone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Director Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.directorName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Director Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.directorPhone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        ED Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.EDName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        ED Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.mod.EDPhone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'error.main' }}>
                                        {formatCurrency(data.mod.amount || 0)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </DashboardContent>
    )
}

export default ViewNVT