import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  customer: yup.string().required('Customer name is required'),
  introducerName: yup.string().required("introducer is required"), 
  totalPayment: yup
    .number()
    .typeError('Total payment must be a number')
    .required('Total payment is required'),
  emi: yup
    .number()
    .typeError('EMI must be a number')
    .required('EMI is required'),
  initialPayment: yup
    .number()
    .typeError('Initial payment must be a number')
    .required('Initial payment is required'),
  conversion: yup.string().required('Conversion is required'),
  needMod: yup.boolean().required("mod is required"), // Changed from optional() to notRequired()
});