import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
})

export const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
})

export interface TransactionDetails {
    order_id: string
    gross_amount: number
}

export interface CustomerDetails {
    first_name: string
    email: string
    phone?: string
}

export async function createSnapTransaction(
    transactionDetails: TransactionDetails,
    customerDetails: CustomerDetails,
    itemDetails?: any[]
) {
    const parameter = {
        transaction_details: transactionDetails,
        credit_card: {
            secure: true,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
    }

    try {
        const transaction = await snap.createTransaction(parameter)
        return transaction
    } catch (error) {
        console.error('Midtrans Error:', error)
        throw error
    }
}
