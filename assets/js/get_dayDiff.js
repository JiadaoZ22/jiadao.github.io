// // // // // // // // // // // // // // // // // // // // // // // // // // 
// Compute difference between now and a date
function calculateDateDifference() {
    // Set the target date (August 9, 2023)
    const targetDate = new Date('2023-08-09');
    
    // Get today's date
    const today = new Date();
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(today - targetDate);
    
    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, and remaining days
    let years = 0;
    let months = 0;
    let remainingDays = diffDays;
    
    // Approximate calculation for years and months
    years = Math.floor(diffDays / 365);
    remainingDays = diffDays % 365;
    months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;
    
    // Create the output message
    let message = `${diffDays} days`;
    if (years > 0 || months > 0) {
        message = `${years} years, ${months} months, and ${remainingDays} days`;
    }
  
    // // Create the output message
    // let message = `Time between today and August 9, 2023: ${diffDays} days`;
    // if (years > 0 || months > 0) {
    //     message += ` (approximately ${years} years, ${months} months, and ${remainingDays} days)`;
    // }
    
    return message;
  }
  
  // Calculate the date difference when the script loads
  const dateDifferenceMessage = calculateDateDifference();
  // // // // // // // // // // // // // // // // // // // // // // // // // // 