import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  name: yup.string().required('Customer name is required'),
  customerId: yup.string().required('Customer ID is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  introducer: yup.string().required("introducer is required"), 
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
  mod: yup.boolean().required("mod is required"), // Changed from optional() to notRequired()
});