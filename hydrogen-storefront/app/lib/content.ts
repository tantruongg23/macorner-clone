// Centralized content data for Macorner
export interface ProductCard {
  title: string;
  price: string;
  imageSrc: string;
  href: string;
  alt: string;
}

export interface TabSection {
  label: string;
  products: ProductCard[];
}

export interface PhotoCategory {
  label: string;
  imageSrc: string;
  href: string;
  alt: string;
}

export interface ReviewPhoto {
  imageSrc: string;
  alt: string;
}

export const HERO = {
  title: "Father's Day",
  subtitle: "Thoughtful pieces made for everyday moments with Dad.",
  cta: "Shop Now",
  ctaHref: "#",
  imageSrc: "/images/Gifts_For_Dads_homepage_banner.webp",
  imageAlt: "Father's Day gifts",
};

export const TRENDING_NOW: ProductCard[] = [
  {
    title: "Father's Day Gifts, Best Dad By Par, Best Grandpa By Par - Personalized Cap",
    price: "$29.95 USD",
    imageSrc: "/images/Best_Dad_By_Par_Best_Grandpa_By_Par_Personalized_Cap_1.jpg",
    href: "#",
    alt: "Best Dad By Par Personalized Cap",
  },
  {
    title: "Father's Day Gifts, The Dad Times Drive Safe, Daddy We Love You - Personalized Car Visor Clip",
    price: "$24.95 USD",
    imageSrc: "/images/The_Dad_Times_Drive_Safe_Daddy_We_Love_You_Personalized_Car_Visor_Clip_1.jpg",
    href: "#",
    alt: "The Dad Times Drive Safe Personalized Car Visor Clip",
  },
  {
    title: "Senior Custom Vintage Photo - Personalized Cups",
    price: "$25.95 USD",
    imageSrc: "/images/Senior_Custom_Vintage_Photo_Personalized_Cups_1.jpg",
    href: "#",
    alt: "Senior Custom Vintage Photo Cups",
  },
  {
    title: "Father's Day Gifts, Classic Limited Edition - Birthday Gift, Vintage Old Age Gift For Him, Dad, Husband, Grandpa - Personalized Shirt",
    price: "$24.95 USD",
    imageSrc: "/images/Classic-Limited-Edition-Birthday-Gift_-Vintage-Old-Age-Gift-For-Him_-Dad_-Husband_-Grandpa-Personalized-Shirt_1.png",
    href: "#",
    alt: "Classic Limited Edition Personalized Shirt",
  },
  {
    title: "Father's Day Gifts, We Love You Custom Photo Sketch Line Art - Personalized Desk Mat",
    price: "$32.95 USD",
    imageSrc: "/images/We_Love_You_Custom_Photo_Sketch_Line_Art_Fathers_Day_Gift_For_Husband_Dad_Personalized_Desk_Mat_1.jpg",
    href: "#",
    alt: "We Love You Custom Photo Sketch Line Art Desk Mat",
  },
  {
    title: "Thank You For Celebrating With Us - Personalized Cups",
    price: "$25.95 USD",
    imageSrc: "/images/Thank_You_For_Celebrating_With_Us_Personalized_Cups_1.jpg",
    href: "#",
    alt: "Thank You For Celebrating With Us Cups",
  },
  {
    title: "Father's Day Gifts, Everything Tastes Better When Grandpa, Dad Grills It - Personalized Cutting Board",
    price: "$39.95 USD",
    imageSrc: "/images/Everything_Tastes_Better_When_Grandpa_Dad_Grills_It_Father_S_Day_Gift_Personalized_Cutting_Board_1.jpg",
    href: "#",
    alt: "Everything Tastes Better When Grandpa Cutting Board",
  },
  {
    title: "Father's Day Gifts, Dad's Grilling Buddies - Personalized Platter",
    price: "$32.95 USD",
    imageSrc: "/images/Dads_Grilling_Buddies_Fathers_Day_Gift_For_Daddy_Husband_Grandpa_Personalized_Platter_1.jpg",
    href: "#",
    alt: "Dad's Grilling Buddies Personalized Platter",
  },
];

export const MADE_FOR_DADS_TABS: TabSection[] = [
  {
    label: "Caps",
    products: [
      {
        title: "Best Dad By Par, Best Grandpa By Par - Personalized Cap",
        price: "$29.95 USD",
        imageSrc: "/images/Best_Dad_By_Par_Best_Grandpa_By_Par_Personalized_Cap_1.jpg",
        href: "#",
        alt: "Best Dad By Par Personalized Cap",
      },
      {
        title: "Fist Bump Daddy Grandpa - Personalized Classic Cap",
        price: "$29.95 USD",
        imageSrc: "/images/Fist-Bump-Daddy-Grandpa-Personalized-Classic-Cap_1.jpg",
        href: "#",
        alt: "Fist Bump Daddy Grandpa Personalized Cap",
      },
      {
        title: "Best Dad Ever - Metal Style Print - Personalized Cap",
        price: "$29.95 USD",
        imageSrc: "/images/Best_Dad_Ever_Metal_Style_Print_Personalized_Cap_1.jpg",
        href: "#",
        alt: "Best Dad Ever Metal Style Personalized Cap",
      },
      {
        title: "Dad, The Man, The Myth, The Legend - Personalized Leather Patch Hat",
        price: "$34.95 USD",
        imageSrc: "/images/Dad_-The-Man_-The-Myth_-The-Legend-Personalized-Leather-Patch-Hat_1.jpg",
        href: "#",
        alt: "Dad The Man The Myth Personalized Hat",
      },
    ],
  },
  {
    label: "Shirts",
    products: [
      {
        title: "Classic Limited Edition - Personalized Shirt",
        price: "$24.95 USD",
        imageSrc: "/images/Classic-Limited-Edition-Birthday-Gift_-Vintage-Old-Age-Gift-For-Him_-Dad_-Husband_-Grandpa-Personalized-Shirt_1.png",
        href: "#",
        alt: "Classic Limited Edition Personalized Shirt",
      },
      {
        title: "Best Dad Ever USA Flag - Personalized Hawaiian Shirt",
        price: "$32.95 USD",
        imageSrc: "/images/Best_Dad_Ever_USA_Flag_Personalized_Hawaiian_Shirt_1.jpg",
        href: "#",
        alt: "Best Dad Ever USA Flag Hawaiian Shirt",
      },
      {
        title: "Fatherhood Is Kingdom Work - Personalized Shirt",
        price: "$29.95 USD",
        imageSrc: "/images/Fatherhood-Is-Kingdom-Work-Personalized-Shirt-1.jpg",
        href: "#",
        alt: "Fatherhood Is Kingdom Work Shirt",
      },
      {
        title: "Dad The Man The Myth The Legend - Personalized Shirt",
        price: "$24.95 USD",
        imageSrc: "/images/DadTheManTheMythTheLegend-PersonalizedShirt_1.jpg",
        href: "#",
        alt: "Dad The Man The Myth The Legend Shirt",
      },
    ],
  },
  {
    label: "Car Visor Clips",
    products: [
      {
        title: "The Dad Times Drive Safe - Personalized Car Visor Clip",
        price: "$24.95 USD",
        imageSrc: "/images/The_Dad_Times_Drive_Safe_Daddy_We_Love_You_Personalized_Car_Visor_Clip_1.jpg",
        href: "#",
        alt: "The Dad Times Drive Safe Visor Clip",
      },
      {
        title: "Custom Photo Drive Safe Daddy - Personalized Visor Clip",
        price: "$24.95 USD",
        imageSrc: "/images/Custom-Photo-Drive-Safe-Daddy-Personalized-Wooden-Photo-Car-Visor-Clip_1.jpg",
        href: "#",
        alt: "Custom Photo Drive Safe Daddy Visor Clip",
      },
      {
        title: "Custom Family Polaroid Photo - Personalized Visor Clip",
        price: "$24.95 USD",
        imageSrc: "/images/Custom-Family-Polaroid-Photo-_-Message-For-Him_-Daddy_-Papa-Personalized-Wooden-Photo-Car-Visor-Clip_1.jpg",
        href: "#",
        alt: "Custom Family Polaroid Visor Clip",
      },
      {
        title: "Drive Safe Daddy - Personalized Acrylic Visor Clip",
        price: "$24.95 USD",
        imageSrc: "/images/Drive_Safe_Daddy_Papa_Mommy_Uncle_Upload_Cute_Kid_s_Photo_Personalized_Acrylic_Photo_Visor_Clip_1.jpg",
        href: "#",
        alt: "Drive Safe Daddy Acrylic Visor Clip",
      },
    ],
  },
];

export const FOR_YOUR_GRAD_TABS: TabSection[] = [
  {
    label: "Frosted Cups",
    products: [
      {
        title: "Senior Custom Vintage Photo - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Senior_Custom_Vintage_Photo_Personalized_Cups_1.jpg",
        href: "#",
        alt: "Senior Custom Vintage Photo Cups",
      },
      {
        title: "Custom Vintage Childhood Photo - Graduation Gift Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Graduation_Custom_Face_And_Name_Personalized_Cups_0.jpg",
        href: "#",
        alt: "Custom Vintage Childhood Photo Cups",
      },
      {
        title: "Graduation Custom Face and Name - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Graduation_Party_Personalized_Cups_1.jpg",
        href: "#",
        alt: "Graduation Custom Face Cups",
      },
      {
        title: "Graduation Party - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Graduation_Custom_Face_And_Name_Personalized_Cups_0.jpg",
        href: "#",
        alt: "Graduation Party Cups",
      },
    ],
  },
  {
    label: "Fans",
    products: [
      {
        title: "Custom Vintage Childhood Photo - Personalized Graduation Fan",
        price: "$22.95 USD",
        imageSrc: "/images/Custom_Vintage_Childhood_Photo_Graduation_Gift_Personalized_Graduation_Fan_1.jpg",
        href: "#",
        alt: "Custom Vintage Childhood Graduation Fan",
      },
      {
        title: "Graduation Custom Face and Name - Personalized Fan",
        price: "$22.95 USD",
        imageSrc: "/images/Graduation_Custom_Face_And_Name_Personalized_Graduation_Fan_1.jpg",
        href: "#",
        alt: "Graduation Custom Face Fan",
      },
      {
        title: "Custom Photo Graduation Gifts - Personalized Fan",
        price: "$22.95 USD",
        imageSrc: "/images/Custom-Photo-Graduation-Gifts-Personalized-Graduation-Fan_6.jpg",
        href: "#",
        alt: "Custom Photo Graduation Fan",
      },
      {
        title: "Graduation Custom Vintage Photo Fan",
        price: "$22.95 USD",
        imageSrc: "/images/Custom_Vintage_Childhood_Photo_Graduation_Gift_Personalized_Graduation_Fan_1.jpg",
        href: "#",
        alt: "Graduation Custom Vintage Fan",
      },
    ],
  },
];

export const AMERICAS_250TH_TABS: TabSection[] = [
  {
    label: "Frosted Cups",
    products: [
      {
        title: "Thank You For Celebrating With Us - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Thank_You_For_Celebrating_With_Us_Personalized_Cups_1.jpg",
        href: "#",
        alt: "Thank You For Celebrating Cups",
      },
      {
        title: "Red White & Boom - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Red_White_Boom_Personalized_Cups_1.jpg",
        href: "#",
        alt: "Red White Boom Cups",
      },
      {
        title: "Celebrating 'Merica 250 Years Of Freedom - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/Celebrating_Merica_250_Years_Of_Freedom_Personalized_Cups_1.jpg",
        href: "#",
        alt: "Celebrating Merica 250 Years Cups",
      },
      {
        title: "250 Years Of Freedom - Personalized Cups",
        price: "$25.95 USD",
        imageSrc: "/images/250_Years_Of_Freedom_Personalized_Cups_1.jpg",
        href: "#",
        alt: "250 Years Of Freedom Cups",
      },
    ],
  },
];

export const SHOP_BY_RECIPIENT: PhotoCategory[] = [
  { label: "For Bestie", imageSrc: "/images/recipient-bestie.webp", href: "#", alt: "For Bestie" },
  { label: "For Partner", imageSrc: "/images/recipient-partner.webp", href: "#", alt: "For Partner" },
  { label: "For Sibling", imageSrc: "/images/recipient-sibling.webp", href: "#", alt: "For Sibling" },
  { label: "For Pet Lover", imageSrc: "/images/recipient-pet-lover.webp", href: "#", alt: "For Pet Lover" },
  { label: "For Family", imageSrc: "/images/recipient-family.webp", href: "#", alt: "For Family" },
  { label: "For Mom", imageSrc: "/images/recipient-mom.webp", href: "#", alt: "For Mom" },
  { label: "For Dad", imageSrc: "/images/recipient-dad.webp", href: "#", alt: "For Dad" },
  { label: "For Kid & Baby", imageSrc: "/images/recipient-kid-baby.webp", href: "#", alt: "For Kid & Baby" },
];

export const SHOP_BY_PRODUCT: PhotoCategory[] = [
  { label: "Graduation Stole", imageSrc: "/images/Graduation_Stole.webp", href: "#", alt: "Graduation Stole" },
  { label: "Doormat", imageSrc: "/images/Doormat.webp", href: "#", alt: "Doormat" },
  { label: "Tassel Charm", imageSrc: "/images/Graduation_Tassel.jpg", href: "#", alt: "Tassel Charm" },
  { label: "Pocket Hug", imageSrc: "/images/Pocket_Hug.webp", href: "#", alt: "Pocket Hug" },
  { label: "Beach Towel", imageSrc: "/images/Kid_Beach_Towel.webp", href: "#", alt: "Beach Towel" },
  { label: "Jewelry Dish", imageSrc: "/images/Jewelry_Dish_71883d7b-e07d-45c9-9979-b0e8f781cc02.webp", href: "#", alt: "Jewelry Dish" },
  { label: "Wooden Plaque", imageSrc: "/images/2-Layered_Wooden_Plaque_With_Base.webp", href: "#", alt: "Wooden Plaque" },
  { label: "Shirt", imageSrc: "/images/Shirt_3448bf30-7449-4a00-8235-e9a51c5d4610.webp", href: "#", alt: "Shirt" },
  { label: "Car Accessories", imageSrc: "/images/Car_Visor_Clip.jpg", href: "#", alt: "Car Accessories" },
  { label: "Belt", imageSrc: "/images/Belt.webp", href: "#", alt: "Belt" },
  { label: "Whiskey Glass", imageSrc: "/images/Whiskey_Glass_2a0e6b84-bce4-498d-8a30-91788ba3449f.webp", href: "#", alt: "Whiskey Glass" },
  { label: "Mug", imageSrc: "/images/Mug_e104b31d-b065-4f0d-9104-2517ffccb52f.webp", href: "#", alt: "Mug" },
];

export const HAPPY_CUSTOMERS_PHOTOS: ReviewPhoto[] = [
  { imageSrc: "/images/1767831298__img_7222__original.jpg", alt: "Happy customer photo" },
  { imageSrc: "/images/1766799891__img_8052__original.jpg", alt: "Happy customer photo" },
  { imageSrc: "/images/1757624250__1757624240226-annive.jpg", alt: "Happy customer photo" },
  { imageSrc: "/images/1742129385__1742129381601-img_20.jpg", alt: "Happy customer photo" },
  { imageSrc: "/images/Photo_review_homepage_2.jpg", alt: "Happy customer photo" },
  { imageSrc: "/images/Review_photo_2_78120947-5c93-4ada-a136-720631c02c20.jpg", alt: "Happy customer photo" },
];
