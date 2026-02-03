// Real-time Discount Service for Flight Booking Platform
import { toast } from 'react-toastify';

class DiscountService {
  constructor() {
    this.discounts = this.initializeDiscounts();
    this.userDiscounts = this.getUserDiscounts();
    this.flashSales = this.initializeFlashSales();
    this.loyaltyProgram = this.initializeLoyaltyProgram();
  }

  // Initialize all available discounts with real-time dates
  initializeDiscounts() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Dynamic date calculations
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const oneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonths = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
    const threeMonths = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const sixMonths = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);
    const oneYear = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    // Current month and year
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Festival dates (dynamic based on current year)
    const diwaliDate = new Date(currentYear, 10, 12); // November 12 (approximate)
    const christmasDate = new Date(currentYear, 11, 25); // December 25
    const newYearDate = new Date(currentYear + 1, 0, 1); // January 1 next year
    const valentineDate = new Date(currentYear, 1, 14); // February 14
    const mothersDate = new Date(currentYear, 4, 12); // May 12 (Mother's Day)
    
    // Adjust festival dates if they've passed this year
    if (diwaliDate < today) diwaliDate.setFullYear(currentYear + 1);
    if (christmasDate < today) christmasDate.setFullYear(currentYear + 1);
    if (valentineDate < today) valentineDate.setFullYear(currentYear + 1);
    if (mothersDate < today) mothersDate.setFullYear(currentYear + 1);

    return {
      // Flash Sales (Very Short Duration - Hours)
      flash: [
        {
          id: 'FLASH2024',
          code: 'FLASH40',
          title: '⚡ Flash Sale',
          description: 'Limited time mega discount!',
          discount: 40,
          type: 'percentage',
          validUntil: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
          minAmount: 25000,
          maxDiscount: 10000,
          applicable: ['domestic', 'international'],
          active: true,
          isFlash: true,
          remainingUses: 50
        },
        {
          id: 'MEGASALE2024',
          code: 'MEGA50',
          title: '🔥 Mega Flash Sale',
          description: 'Biggest discount of the day!',
          discount: 50,
          type: 'percentage',
          validUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
          minAmount: 30000,
          maxDiscount: 15000,
          applicable: ['international'],
          active: true,
          isFlash: true,
          remainingUses: 25
        },
        {
          id: 'HOURLY2024',
          code: 'HOURLY30',
          title: '⏰ Hourly Deal',
          description: 'Next 3 hours only!',
          discount: 30,
          type: 'percentage',
          validUntil: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
          minAmount: 15000,
          maxDiscount: 7500,
          applicable: ['domestic', 'international'],
          active: true,
          isFlash: true,
          remainingUses: 100
        }
      ],

      // Daily Deals (1-7 days)
      daily: [
        {
          id: 'TODAY2024',
          code: 'TODAY25',
          title: '📅 Today Only',
          description: 'Book today and save big!',
          discount: 25,
          type: 'percentage',
          validUntil: new Date(today.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000), // End of today
          minAmount: 12000,
          maxDiscount: 5000,
          applicable: ['domestic', 'international'],
          active: true
        },
        {
          id: 'WEEKEND2024',
          code: 'WEEKEND20',
          title: '🎯 Weekend Special',
          description: 'Weekend bookings get special rates',
          discount: 20,
          type: 'percentage',
          validUntil: nextWeek,
          minAmount: 10000,
          maxDiscount: 4000,
          applicable: ['domestic'],
          active: true,
          weekendOnly: true
        },
        {
          id: 'WEEKLY2024',
          code: 'WEEK15',
          title: '📆 Weekly Deal',
          description: 'Valid for the next 7 days',
          discount: 15,
          type: 'percentage',
          validUntil: nextWeek,
          minAmount: 8000,
          maxDiscount: 3000,
          applicable: ['domestic', 'international'],
          active: true
        }
      ],

      // First Time User Discounts (2 weeks validity)
      firstTime: [
        {
          id: 'WELCOME2024',
          code: 'WELCOME30',
          title: '🎉 Welcome Bonus',
          description: 'First flight? First discount!',
          discount: 30,
          type: 'percentage',
          validUntil: twoWeeks,
          minAmount: 8000,
          maxDiscount: 4000,
          applicable: ['domestic', 'international'],
          active: true,
          userType: 'new'
        },
        {
          id: 'NEWUSER2024',
          code: 'NEWUSER25',
          title: '🆕 New User Special',
          description: 'Welcome aboard! Enjoy your first booking discount',
          discount: 25,
          type: 'percentage',
          validUntil: twoWeeks,
          minAmount: 5000,
          maxDiscount: 3000,
          applicable: ['domestic', 'international'],
          active: true,
          userType: 'new'
        },
        {
          id: 'FIRSTFLY2024',
          code: 'FIRSTFLY35',
          title: '✈️ First Flight Special',
          description: 'Your journey begins with savings!',
          discount: 35,
          type: 'percentage',
          validUntil: twoWeeks,
          minAmount: 10000,
          maxDiscount: 5000,
          applicable: ['domestic', 'international'],
          active: true,
          userType: 'new'
        }
      ],

      // Monthly Deals (1 month validity)
      monthly: [
        {
          id: 'MONTHLY2024',
          code: 'MONTH20',
          title: '📅 Monthly Special',
          description: 'Valid for the entire month',
          discount: 20,
          type: 'percentage',
          validUntil: oneMonth,
          minAmount: 12000,
          maxDiscount: 5000,
          applicable: ['domestic', 'international'],
          active: true
        },
        {
          id: 'EARLYBIRD2024',
          code: 'EARLY18',
          title: '🐦 Early Bird',
          description: 'Book 30+ days in advance',
          discount: 18,
          type: 'percentage',
          validUntil: oneMonth,
          minAmount: 15000,
          maxDiscount: 6000,
          applicable: ['domestic', 'international'],
          active: true,
          advanceDays: 30
        }
      ],

      // Seasonal Discounts (2-3 months validity)
      seasonal: [
        {
          id: 'SUMMER2024',
          code: 'SUMMER25',
          title: '🌞 Summer Special',
          description: 'Beat the heat with cool savings!',
          discount: 25,
          type: 'percentage',
          validUntil: threeMonths,
          minAmount: 15000,
          maxDiscount: 7500,
          applicable: ['domestic', 'international'],
          active: true
        },
        {
          id: 'MONSOON2024',
          code: 'MONSOON22',
          title: '🌧️ Monsoon Magic',
          description: 'Rainy season, sunny prices!',
          discount: 22,
          type: 'percentage',
          validUntil: twoMonths,
          minAmount: 12000,
          maxDiscount: 5500,
          applicable: ['domestic'],
          active: true
        },
        {
          id: 'WINTER2024',
          code: 'WINTER28',
          title: '❄️ Winter Wonderland',
          description: 'Chill out with hot deals!',
          discount: 28,
          type: 'percentage',
          validUntil: threeMonths,
          minAmount: 18000,
          maxDiscount: 8000,
          applicable: ['domestic', 'international'],
          active: true
        }
      ],

      // Festival Discounts (Specific dates)
      festival: [
        {
          id: 'DIWALI2024',
          code: 'DIWALI35',
          title: '🪔 Diwali Dhamaka',
          description: 'Festival of lights, festival of savings!',
          discount: 35,
          type: 'percentage',
          validUntil: diwaliDate,
          minAmount: 15000,
          maxDiscount: 8500,
          applicable: ['domestic', 'international'],
          active: diwaliDate > today
        },
        {
          id: 'CHRISTMAS2024',
          code: 'XMAS30',
          title: '🎄 Christmas Joy',
          description: 'Ho ho ho-ly savings!',
          discount: 30,
          type: 'percentage',
          validUntil: christmasDate,
          minAmount: 20000,
          maxDiscount: 9000,
          applicable: ['international'],
          active: christmasDate > today
        },
        {
          id: 'NEWYEAR2025',
          code: 'NEWYEAR40',
          title: '🎊 New Year Blast',
          description: 'Start the year with amazing savings!',
          discount: 40,
          type: 'percentage',
          validUntil: new Date(newYearDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days after New Year
          minAmount: 25000,
          maxDiscount: 12000,
          applicable: ['domestic', 'international'],
          active: true
        },
        {
          id: 'VALENTINE2024',
          code: 'LOVE25',
          title: '💕 Valentine Special',
          description: 'Love is in the air, and so are savings!',
          discount: 25,
          type: 'percentage',
          validUntil: new Date(valentineDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Week after Valentine's
          minAmount: 12000,
          maxDiscount: 5000,
          applicable: ['domestic', 'international'],
          active: valentineDate > today || (valentineDate.getTime() + 7 * 24 * 60 * 60 * 1000) > today.getTime()
        },
        {
          id: 'MOTHERS2024',
          code: 'MOM30',
          title: '👩 Mother\'s Day Special',
          description: 'Celebrate mom with special savings',
          discount: 30,
          type: 'percentage',
          validUntil: new Date(mothersDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Week after Mother's Day
          minAmount: 10000,
          maxDiscount: 4500,
          applicable: ['domestic', 'international'],
          active: mothersDate > today || (mothersDate.getTime() + 7 * 24 * 60 * 60 * 1000) > today.getTime()
        }
      ],

      // Group Booking Discounts (6 months validity)
      group: [
        {
          id: 'GROUP2024',
          code: 'GROUP12',
          title: '👥 Group Booking',
          description: '4+ passengers get extra savings',
          discount: 12,
          type: 'percentage',
          validUntil: sixMonths,
          minAmount: 20000,
          maxDiscount: 8000,
          applicable: ['domestic', 'international'],
          active: true,
          minPassengers: 4
        },
        {
          id: 'FAMILY2024',
          code: 'FAMILY18',
          title: '👨‍👩‍👧‍👦 Family Pack',
          description: 'Family of 3+ gets special rates',
          discount: 18,
          type: 'percentage',
          validUntil: sixMonths,
          minAmount: 15000,
          maxDiscount: 6500,
          applicable: ['domestic', 'international'],
          active: true,
          minPassengers: 3
        },
        {
          id: 'BIGGROUP2024',
          code: 'BIGGROUP20',
          title: '👥 Large Group',
          description: '6+ passengers get maximum savings',
          discount: 20,
          type: 'percentage',
          validUntil: sixMonths,
          minAmount: 30000,
          maxDiscount: 12000,
          applicable: ['domestic', 'international'],
          active: true,
          minPassengers: 6
        }
      ],

      // Bank Offers (Long term - 1 year)
      bank: [
        {
          id: 'HDFC2024',
          code: 'HDFC20',
          title: '🏦 HDFC Bank Offer',
          description: 'Exclusive for HDFC cardholders',
          discount: 20,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 12000,
          maxDiscount: 5000,
          applicable: ['domestic', 'international'],
          active: true,
          bankName: 'HDFC'
        },
        {
          id: 'SBI2024',
          code: 'SBI18',
          title: '🏦 SBI Special',
          description: 'State Bank of India exclusive',
          discount: 18,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 10000,
          maxDiscount: 4000,
          applicable: ['domestic', 'international'],
          active: true,
          bankName: 'SBI'
        },
        {
          id: 'ICICI2024',
          code: 'ICICI22',
          title: '🏦 ICICI Bank Deal',
          description: 'ICICI Bank customers save more',
          discount: 22,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 11000,
          maxDiscount: 5500,
          applicable: ['domestic', 'international'],
          active: true,
          bankName: 'ICICI'
        },
        {
          id: 'AXIS2024',
          code: 'AXIS15',
          title: '🏦 Axis Bank Offer',
          description: 'Axis Bank exclusive savings',
          discount: 15,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 9000,
          maxDiscount: 3500,
          applicable: ['domestic', 'international'],
          active: true,
          bankName: 'AXIS'
        }
      ],

      // High Value Booking Discounts (Automatic)
      highValue: [
        {
          id: 'PREMIUM2024',
          code: 'PREMIUM5',
          title: '💎 Premium Booking',
          description: 'Automatic 5% discount for bookings over ₹5 lakhs',
          discount: 5,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 500000, // 5 lakhs
          maxDiscount: 50000, // Max 50k discount
          applicable: ['domestic', 'international'],
          active: true,
          isAutomatic: true
        },
        {
          id: 'LUXURY2024',
          code: 'LUXURY7',
          title: '🏆 Luxury Booking',
          description: 'Automatic 7% discount for bookings over ₹10 lakhs',
          discount: 7,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 1000000, // 10 lakhs
          maxDiscount: 100000, // Max 1 lakh discount
          applicable: ['domestic', 'international'],
          active: true,
          isAutomatic: true
        }
      ],

      // Special Occasion Discounts
      special: [
        {
          id: 'STUDENT2024',
          code: 'STUDENT25',
          title: '🎓 Student Special',
          description: 'Valid student ID required',
          discount: 25,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 8000,
          maxDiscount: 4000,
          applicable: ['domestic', 'international'],
          active: true,
          requiresVerification: true
        },
        {
          id: 'SENIOR2024',
          code: 'SENIOR20',
          title: '👴 Senior Citizen',
          description: '60+ years get special rates',
          discount: 20,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 5000,
          maxDiscount: 3000,
          applicable: ['domestic', 'international'],
          active: true,
          ageRequirement: 60
        },
        {
          id: 'BUSINESS2024',
          code: 'BIZTRAVEL18',
          title: '💼 Business Travel',
          description: 'Corporate bookings get special rates',
          discount: 18,
          type: 'percentage',
          validUntil: oneYear,
          minAmount: 15000,
          maxDiscount: 7000,
          applicable: ['domestic', 'international'],
          active: true
        }
      ]
    };
  }

  // Initialize flash sales with real-time countdown timers
  initializeFlashSales() {
    const now = new Date();
    
    return [
      {
        id: 'MEGA_FLASH_1',
        title: '⚡ MEGA FLASH SALE',
        description: 'Up to 50% OFF on International Flights',
        discount: 50,
        type: 'percentage',
        startTime: now,
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        routes: ['Delhi → London', 'Mumbai → Dubai', 'Bangalore → Singapore'],
        maxDiscount: 15000,
        remainingSlots: 25,
        totalSlots: 100,
        active: true
      },
      {
        id: 'DOMESTIC_FLASH_1',
        title: '🔥 Domestic Flash Deal',
        description: '40% OFF on Premium Domestic Routes',
        discount: 40,
        type: 'percentage',
        startTime: now,
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        routes: ['Delhi → Mumbai', 'Bangalore → Chennai', 'Hyderabad → Pune'],
        maxDiscount: 8000,
        remainingSlots: 15,
        totalSlots: 50,
        active: true
      },
      {
        id: 'HOURLY_FLASH_1',
        title: '⏰ Hourly Flash',
        description: '35% OFF - Next Hour Only!',
        discount: 35,
        type: 'percentage',
        startTime: now,
        endTime: new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
        routes: ['Chennai → Bangalore', 'Mumbai → Pune', 'Delhi → Jaipur'],
        maxDiscount: 6000,
        remainingSlots: 30,
        totalSlots: 75,
        active: true
      },
      {
        id: 'SUPER_FLASH_1',
        title: '💥 Super Flash Sale',
        description: '45% OFF - Limited Time Only!',
        discount: 45,
        type: 'percentage',
        startTime: now,
        endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        routes: ['All International Routes'],
        maxDiscount: 12000,
        remainingSlots: 20,
        totalSlots: 60,
        active: true
      }
    ];
  }

  // Initialize loyalty program
  initializeLoyaltyProgram() {
    return {
      tiers: {
        bronze: { minSpent: 0, discount: 5, benefits: ['Priority Support'] },
        silver: { minSpent: 50000, discount: 10, benefits: ['Priority Support', 'Free Seat Selection'] },
        gold: { minSpent: 150000, discount: 15, benefits: ['Priority Support', 'Free Seat Selection', 'Lounge Access'] },
        platinum: { minSpent: 300000, discount: 20, benefits: ['Priority Support', 'Free Seat Selection', 'Lounge Access', 'Free Upgrades'] }
      }
    };
  }

  // Get user-specific discounts from localStorage
  getUserDiscounts() {
    try {
      const stored = localStorage.getItem('user_discounts');
      return stored ? JSON.parse(stored) : {
        usedCodes: [],
        totalSavings: 0,
        loyaltyPoints: 0,
        tier: 'bronze',
        totalSpent: 0
      };
    } catch (error) {
      console.error('Error loading user discounts:', error);
      return {
        usedCodes: [],
        totalSavings: 0,
        loyaltyPoints: 0,
        tier: 'bronze',
        totalSpent: 0
      };
    }
  }

  // Save user discounts to localStorage
  saveUserDiscounts() {
    try {
      localStorage.setItem('user_discounts', JSON.stringify(this.userDiscounts));
    } catch (error) {
      console.error('Error saving user discounts:', error);
    }
  }

  // Get all available discounts for display
  getAllDiscounts() {
    const allDiscounts = [];
    
    Object.values(this.discounts).forEach(category => {
      if (Array.isArray(category)) {
        allDiscounts.push(...category.filter(d => d.active));
      }
    });

    return allDiscounts.sort((a, b) => b.discount - a.discount);
  }

  // Get applicable discounts for a specific booking
  getApplicableDiscounts(bookingData) {
    const { amount, passengers, flightType, departureDate, userType, age } = bookingData;
    const applicable = [];

    // Check all discount categories
    Object.values(this.discounts).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(discount => {
          if (this.isDiscountApplicable(discount, bookingData)) {
            applicable.push(discount);
          }
        });
      }
    });

    // Add flash sales
    this.flashSales.forEach(flash => {
      if (flash.active && flash.remainingSlots > 0) {
        applicable.push({
          ...flash,
          code: `FLASH${flash.id}`,
          isFlash: true
        });
      }
    });

    return applicable.sort((a, b) => b.discount - a.discount);
  }

  // Check if discount is applicable
  isDiscountApplicable(discount, bookingData) {
    const { amount, passengers, flightType, departureDate, userType, age } = bookingData;

    // Check if discount is active and not expired
    if (!discount.active || new Date() > new Date(discount.validUntil)) {
      return false;
    }

    // Check minimum amount
    if (amount < discount.minAmount) {
      return false;
    }

    // Check if user has already used this code
    if (this.userDiscounts.usedCodes.includes(discount.code)) {
      return false;
    }

    // Check flight type applicability
    if (discount.applicable && !discount.applicable.includes(flightType)) {
      return false;
    }

    // Check user type (new/existing)
    if (discount.userType === 'new' && userType !== 'new') {
      return false;
    }

    // Check minimum passengers for group discounts
    if (discount.minPassengers && passengers < discount.minPassengers) {
      return false;
    }

    // Check advance booking requirement
    if (discount.advanceDays) {
      const daysDiff = Math.ceil((new Date(departureDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysDiff < discount.advanceDays) {
        return false;
      }
    }

    // Check weekend requirement
    if (discount.weekendOnly) {
      const day = new Date().getDay();
      if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
        return false;
      }
    }

    // Check age requirement
    if (discount.ageRequirement && age < discount.ageRequirement) {
      return false;
    }

    return true;
  }

  // Check for automatic discounts (like high-value booking discounts)
  checkAutomaticDiscounts(bookingAmount) {
    const automaticDiscounts = [];
    
    // Check high-value booking discounts
    if (this.discounts.highValue) {
      this.discounts.highValue.forEach(discount => {
        if (discount.isAutomatic && bookingAmount >= discount.minAmount && discount.active) {
          automaticDiscounts.push(discount);
        }
      });
    }
    
    // Return the best automatic discount (highest percentage)
    return automaticDiscounts.sort((a, b) => b.discount - a.discount)[0] || null;
  }

  // Apply discount to booking
  applyDiscount(discountCode, bookingAmount) {
    const discount = this.findDiscountByCode(discountCode);
    
    if (!discount) {
      throw new Error('Invalid discount code');
    }

    if (bookingAmount < discount.minAmount) {
      throw new Error(`Minimum booking amount is ₹${discount.minAmount.toLocaleString()}`);
    }

    let discountAmount = 0;
    
    if (discount.type === 'percentage') {
      discountAmount = Math.min(
        (bookingAmount * discount.discount) / 100,
        discount.maxDiscount || Infinity
      );
    } else if (discount.type === 'fixed') {
      discountAmount = discount.discount;
    }

    // Update flash sale slots if applicable
    if (discount.isFlash) {
      const flashSale = this.flashSales.find(f => f.id === discount.id);
      if (flashSale && flashSale.remainingSlots > 0) {
        flashSale.remainingSlots--;
      }
    }

    // Mark code as used
    if (!this.userDiscounts.usedCodes.includes(discountCode)) {
      this.userDiscounts.usedCodes.push(discountCode);
      this.userDiscounts.totalSavings += discountAmount;
      this.saveUserDiscounts();
    }

    return {
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(bookingAmount - discountAmount),
      discountPercentage: Math.round((discountAmount / bookingAmount) * 100),
      discountDetails: discount
    };
  }

  // Find discount by code
  findDiscountByCode(code) {
    const allDiscounts = this.getAllDiscounts();
    return allDiscounts.find(d => d.code === code) || 
           this.flashSales.find(f => `FLASH${f.id}` === code);
  }

  // Get flash sales with countdown
  getActiveFlashSales() {
    return this.flashSales.filter(flash => {
      const now = new Date();
      return flash.active && 
             now >= new Date(flash.startTime) && 
             now <= new Date(flash.endTime) &&
             flash.remainingSlots > 0;
    });
  }

  // Get user's loyalty tier and benefits
  getUserLoyaltyInfo() {
    const { totalSpent } = this.userDiscounts;
    let currentTier = 'bronze';
    
    if (totalSpent >= 300000) currentTier = 'platinum';
    else if (totalSpent >= 150000) currentTier = 'gold';
    else if (totalSpent >= 50000) currentTier = 'silver';

    return {
      currentTier,
      tierInfo: this.loyaltyProgram.tiers[currentTier],
      totalSpent,
      nextTier: this.getNextTier(currentTier),
      progress: this.getTierProgress(totalSpent, currentTier)
    };
  }

  // Get next loyalty tier
  getNextTier(currentTier) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  // Get tier progress percentage
  getTierProgress(totalSpent, currentTier) {
    const tiers = this.loyaltyProgram.tiers;
    const nextTier = this.getNextTier(currentTier);
    
    if (!nextTier) return 100;
    
    const currentMin = tiers[currentTier].minSpent;
    const nextMin = tiers[nextTier].minSpent;
    
    return Math.min(100, ((totalSpent - currentMin) / (nextMin - currentMin)) * 100);
  }

  // Update user spending for loyalty program
  updateUserSpending(amount) {
    this.userDiscounts.totalSpent += amount;
    this.userDiscounts.loyaltyPoints += Math.floor(amount / 100); // 1 point per ₹100
    this.saveUserDiscounts();
  }

  // Get personalized discount recommendations
  getPersonalizedDiscounts(userProfile) {
    const recommendations = [];
    const { bookingHistory, preferences, demographics } = userProfile;

    // Recommend based on booking frequency
    if (bookingHistory && bookingHistory.length === 0) {
      recommendations.push(this.discounts.firstTime[0]);
    }

    // Recommend based on age
    if (demographics && demographics.age >= 60) {
      recommendations.push(this.discounts.senior[0]);
    }

    // Recommend seasonal discounts
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 3 && currentMonth <= 6) { // Apr-Jul
      recommendations.push(this.discounts.seasonal[0]); // Summer
    } else if (currentMonth >= 6 && currentMonth <= 9) { // Jul-Oct
      recommendations.push(this.discounts.seasonal[1]); // Monsoon
    }

    return recommendations.filter(r => r && r.active);
  }

  // Validate discount code
  validateDiscountCode(code, bookingData) {
    try {
      const discount = this.findDiscountByCode(code);
      
      if (!discount) {
        return { valid: false, message: 'Invalid discount code' };
      }

      if (!discount.active) {
        return { valid: false, message: 'This discount is no longer active' };
      }

      if (new Date() > new Date(discount.validUntil)) {
        return { valid: false, message: 'This discount has expired' };
      }

      if (this.userDiscounts.usedCodes.includes(code)) {
        return { valid: false, message: 'You have already used this discount code' };
      }

      if (bookingData.amount < discount.minAmount) {
        return { 
          valid: false, 
          message: `Minimum booking amount is ₹${discount.minAmount.toLocaleString()}` 
        };
      }

      if (!this.isDiscountApplicable(discount, bookingData)) {
        return { valid: false, message: 'This discount is not applicable to your booking' };
      }

      return { valid: true, discount };
    } catch (error) {
      return { valid: false, message: 'Error validating discount code' };
    }
  }

  // Get discount statistics for admin
  getDiscountStats() {
    return {
      totalDiscounts: this.getAllDiscounts().length,
      activeFlashSales: this.getActiveFlashSales().length,
      totalSavingsDistributed: this.userDiscounts.totalSavings,
      mostUsedCodes: this.getMostUsedCodes(),
      upcomingExpiries: this.getUpcomingExpiries()
    };
  }

  // Get most used discount codes
  getMostUsedCodes() {
    // This would typically come from a database in a real application
    return [
      { code: 'WELCOME30', uses: 1250 },
      { code: 'SUMMER25', uses: 890 },
      { code: 'FLASH40', uses: 650 }
    ];
  }

  // Get discounts expiring soon
  getUpcomingExpiries() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.getAllDiscounts().filter(discount => {
      const expiryDate = new Date(discount.validUntil);
      return expiryDate > now && expiryDate <= sevenDaysFromNow;
    });
  }
}

// Create and export singleton instance
const discountService = new DiscountService();
export default discountService;