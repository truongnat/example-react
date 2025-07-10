export class OTPGenerator {
  static generate(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return otp;
  }

  static isValid(otp: string, length: number = 6): boolean {
    return otp.length === length && /^\d+$/.test(otp);
  }
}
