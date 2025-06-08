'use server'
import { BachelorsFacultyType, BookCategoryLevelType, ExamFacultyType, HighLevelFacultyType, MastersFacultyType } from "@/lib/types/books";
import OpenAI from "openai"
import { bookCategoryLevel, highLevelFaculty, bachelorsFaculty, mastersFaculty, examFaculty } from "@/lib/utils/data";


interface BookCategory {
  level: BookCategoryLevelType;
  year?: string;
  faculty?: HighLevelFacultyType | BachelorsFacultyType | MastersFacultyType | ExamFacultyType;
  class?: string;
}

interface BookMetadata {
  title: string;
  author: string;
  description: string;
  category: BookCategory;
}

interface RawBookData {
  title?: string;
  author?: string;
  description?: string;
  category?: {
    level?: BookCategoryLevelType;
    year?: number;
    faculty?: HighLevelFacultyType | BachelorsFacultyType | MastersFacultyType | ExamFacultyType;
    class?: number;
  };
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": process.env.SITE_NAME || "AI Image Analysis",
    },
});

const bestFormat = `
ACT AS A PRECISE METADATA EXTRACTION ENGINE. Analyze raw OCR text from book covers/title pages and output STRICT JSON with these requirements:

1. OUTPUT FORMAT (MUST FOLLOW EXACTLY):
{
  "title": "string (exact main title)",
  "author": "string (all authors, comma separated)",
  "description": "string (subtitle/key features)",
  "category": {
    "level": "string (EXACTLY one of: 'school','highschool','bachelors','masters','exam','others')",
    "year": "number (ONLY if applicable)",
    "faculty": "string (ONLY from allowed values)",
    "class": "number (ONLY if applicable)"
  }
}

STRICT CATEGORY RULES:

FOR 'school':
→ REQUIRED: "class" (1-10)
→ FORBIDDEN: year/faculty
→ Example: {"level":"school","class":5}

FOR 'highschool':
→ REQUIRED: "class" (11/12) + "faculty" (EXACTLY: 'science','management','humanities','arts','others')
→ FORBIDDEN: year
→ Example: {"level":"highschool","class":11,"faculty":"science"}

FOR 'bachelors':
→ REQUIRED: "year" (1-4) + "faculty" (EXACTLY: 'engineering','medical','business','it','education','arts','others')
→ FORBIDDEN: class
→ Example: {"level":"bachelors","year":3,"faculty":"business"}

FOR 'masters':
→ REQUIRED: "year" (1-2) + "faculty" (same as bachelors)
→ FORBIDDEN: class
→ Example: {"level":"masters","year":1,"faculty":"medical"}

FOR 'exam':
→ REQUIRED: "faculty" (EXACTLY: 'lok-sewa','it-entrance','engineering-entrance','medical','neb','others')
→ FORBIDDEN: year/class
→ Example: {"level":"exam","faculty":"engineering-entrance"}

FOR 'others':
→ ONLY: {"level":"others"}
→ FORBIDDEN: all other fields

PROCESSING RULES:

TITLE: Extract EXACT main title (ignore series/edition numbers unless part of title)

AUTHOR: Include all listed authors (format: "Last1 First1, Last2 First2")

DESCRIPTION: Concise (max 15 words), focus on educational purpose if academic

SANITIZATION:
→ Remove publisher names, ISBNs, prices
→ Convert Roman numerals to digits (XI → 11)
→ Standardize faculty values (e.g., "Sci" → "science")

FAILSAFES:

If ANY field is unclear → omit it

If level cannot be determined → "others"

If faculty doesn't match allowed values → "others"

It is necessary it to be always the acedamic book, it can be of any genre too.

It no book is found no need to scan for it exit the image scanning process.
`;

function validateBookMetadata(data: RawBookData): BookMetadata | null {
  try {
    if (!data || Object.keys(data).length === 0) {
      return {
        title: '',
        author: '',
        description: '',
        category: {
          level: 'others'
        }
      };
    }

    const metadata: BookMetadata = {
      title: data.title || '',
      author: data.author || '',
      description: data.description || '',
      category: {
        level: 'others' 
      }
    };

    if (data.category) {
      const level = data.category.level || 'others';
      if (bookCategoryLevel.includes(level)) {
        metadata.category.level = level;

        switch (level) {
          case 'school':
            if (typeof data.category.class === 'number' && 
                data.category.class >= 1 && 
                data.category.class <= 10) {
              metadata.category.class = data.category.class.toString();
            }
            break;

          case 'highschool':
            if (typeof data.category.class === 'number' && 
                [11, 12].includes(data.category.class)) {
              metadata.category.class = data.category.class.toString();
            }
            if (data.category.faculty && highLevelFaculty.includes(data.category.faculty as HighLevelFacultyType)) {
              metadata.category.faculty = data.category.faculty as HighLevelFacultyType;
            }
            break;

          case 'bachelors':
            if (typeof data.category.year === 'number' && 
                data.category.year >= 1 && 
                data.category.year <= 4) {
              metadata.category.year = data.category.year.toString();
            }
            if (data.category.faculty && bachelorsFaculty.includes(data.category.faculty as BachelorsFacultyType)) {
              metadata.category.faculty = data.category.faculty as BachelorsFacultyType;
            }
            break;

          case 'masters':
            if (typeof data.category.year === 'number' && 
                data.category.year >= 1 && 
                data.category.year <= 2) {
              metadata.category.year = data.category.year.toString();
            }
            if (data.category.faculty && mastersFaculty.includes(data.category.faculty as MastersFacultyType)) {
              metadata.category.faculty = data.category.faculty as MastersFacultyType;
            }
            break;

          case 'exam':
            if (data.category.faculty && examFaculty.includes(data.category.faculty as ExamFacultyType)) {
              metadata.category.faculty = data.category.faculty as ExamFacultyType;
            }
            break;
        }
      }
    }

    return metadata;
  } catch (error) {
    console.error('Validation error:', error);
    return {
      title: '',
      author: '',
      description: '',
      category: {
        level: 'others'
      }
    };
  }
}

export async function extractDataFromImage(imageUrl: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: "opengvlab/internvl3-14b:free",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": bestFormat
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageUrl
                            }
                        }
                    ]
                }
            ],
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content in response');
        }

        let parsedData;
        try {
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                            content.match(/(\{[\s\S]*\})/);
            
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            parsedData = JSON.parse(jsonMatch[1]);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Failed to parse AI response as JSON');
        }

        const validatedData = validateBookMetadata(parsedData);
        if (!validatedData) {
            throw new Error('Invalid book metadata format');
        }

        // Check if the image is actually a book
        if (validatedData.title === 'Not detected' && 
            validatedData.author === 'Not detected' && 
            validatedData.description === 'Not detected') {
            throw new Error('No book is found in the image');
        }

        return {
            success: true,
            result: validatedData
        };
    } catch (error) {
        console.error('AI analysis error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to analyze image'
        };
    }
}


