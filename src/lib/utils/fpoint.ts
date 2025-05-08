/**
 * FPoint utility functions
 * 
 * These functions help with calculating real-time FPoint values based on
 * the Fragmetric API responses.
 */

/**
 * Calculate current FPoint amount based on accrual rate
 * 
 * The Fragmetric API returns values with 4 decimal places precision.
 * This function calculates the current amount based on the time passed since estimation.
 * 
 * @param baseAmount Initial accrual amount (as string from API)
 * @param amountPerSecond Rate of accrual per second (as string from API)
 * @param estimatedAt Timestamp when the estimation was made
 * @param convertDecimals Whether to convert from 4 decimal places to normal value (divide by 10000)
 * @returns The current calculated amount
 */
export function calculateCurrentFPointAmount(
  baseAmount: string,
  amountPerSecond: string,
  estimatedAt: string,
  convertDecimals = true
): number {
  // Parse string values to numbers
  const baseAmountNum = Number(baseAmount)
  const amountPerSecondNum = Number(amountPerSecond)
  
  // Calculate seconds passed since estimation
  const now = new Date()
  const estimatedAtDate = new Date(estimatedAt)
  const secondsPassed = Math.floor((now.getTime() - estimatedAtDate.getTime()) / 1000)
  
  // Calculate current amount
  const currentAmount = baseAmountNum + (amountPerSecondNum * secondsPassed)
  
  // Convert from 4 decimal places if requested
  return convertDecimals ? currentAmount / 10000 : currentAmount
}

/**
 * Format FPoint amount for display
 * 
 * @param amount The amount to format
 * @param precision Number of decimal places to display
 * @returns Formatted string
 */
export function formatFPointAmount(amount: number, precision = 4): string {
  return amount.toFixed(precision)
}

/**
 * Calculate daily accumulation rate
 * 
 * @param amountPerSecond Rate per second (as string from API)
 * @param convertDecimals Whether to convert from 4 decimal places to normal value
 * @returns Daily accumulation rate
 */
export function calculateDailyAccumulation(amountPerSecond: string, convertDecimals = true): number {
  const perSecond = Number(amountPerSecond)
  const perDay = perSecond * 60 * 60 * 24
  return convertDecimals ? perDay / 10000 : perDay
}

/**
 * Convert rank change to display format with color class
 * 
 * @param rankChange The rank change value
 * @returns Object with text and color class
 */
export function formatRankChange(rankChange: number): { text: string; colorClass: string } {
  if (rankChange === 0) {
    return { text: '0', colorClass: '' }
  }
  
  if (rankChange > 0) {
    return { text: `+${rankChange}`, colorClass: 'text-green-500' }
  }
  
  return { text: `${rankChange}`, colorClass: 'text-red-500' }
} 