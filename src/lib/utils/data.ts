const bookCondition = ['New', 'Like New', 'Good', 'Fair', 'Poor'] as const;
const bookType = ['Free', 'Sell', 'Exchange'] as const;
const bookCategoryLevel = ['school','highschool', 'bachelors', 'masters','exam','others'] as const;
const highLevelFaculty = ['science', 'management', 'humanity', 'arts','others'] as const;
const bachelorsFaculty = ["engineering", "medical", "business", "it", 'education', 'arts', 'others' ] as const;
const mastersFaculty = ["engineering", "medical", "business", "it", 'education', 'arts', 'others' ] as const;
const examFaculty = ["lok-sewa",'it-entrance','engineering-entrance','medical','neb','others'] as const;


const bookStatus = ['available', 'requested', 'reserved', 'exchanged', 'sold'] as const;


export {bookCondition, bookType, bookCategoryLevel,
     highLevelFaculty, bachelorsFaculty,mastersFaculty, examFaculty,
     bookStatus
};
