"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useCallback, useState } from "react"

interface CategoryFilterProps {
    onFilterChange: (filters: {
        level: string;
        faculty: string;
        year: string;
        classNum: string;
    }) => void;
}

export function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
    const [level, setLevel] = useState("")
    const [faculty, setFaculty] = useState("")
    const [year, setYear] = useState("")
    const [classNum, setClassNum] = useState("")

    const handleLevelChange = useCallback((val: string) => {
        setLevel(val)
        if (val !== level) {
            setFaculty("")
            setYear("")
            setClassNum("")
        }
    }, [level])

    const handleFacultyChange = useCallback((val: string) => {
        setFaculty(val)
    }, [])

    const handleYearChange = useCallback((val: string) => {
        setYear(val)
    }, [])

    const handleClassNumChange = useCallback((val: string) => {
        setClassNum(val)
    }, [])

    const handleApplyFilters = useCallback(() => {
        onFilterChange({ level, faculty, year, classNum })
    }, [level, faculty, year, classNum, onFilterChange])

    const handleClearFilters = useCallback(() => {
        setLevel("")
        setFaculty("")
        setYear("")
        setClassNum("")
        onFilterChange({ level: "", faculty: "", year: "", classNum: "" })
    }, [onFilterChange])

    return (
        <div className="bg-white p-4 rounded-lg border sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Filter Books</h2>

            <Accordion type="single" collapsible defaultValue="level">
                <AccordionItem value="level">
                    <AccordionTrigger>Education Level</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup value={level} onValueChange={handleLevelChange}>
                            <div className="space-y-2">
                                {["school","highschool","bachelors","masters","exam"].map(lvl => (
                                    <div className="flex items-center space-x-2" key={lvl}>
                                        <RadioGroupItem value={lvl} id={lvl} />
                                        <Label htmlFor={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                {level === "school" && (
                    <AccordionItem value="class">
                        <AccordionTrigger>Class</AccordionTrigger>
                        <AccordionContent>
                            <Select value={classNum} onValueChange={handleClassNumChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(10)].map((_, i) => (
                                        <SelectItem key={i} value={(i + 1).toString()}>
                                            Class {i + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {level === "highschool" && (
                    <>
                        <AccordionItem value="class">
                            <AccordionTrigger>Class</AccordionTrigger>
                            <AccordionContent>
                                <Select value={classNum} onValueChange={handleClassNumChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="11">Class 11</SelectItem>
                                        <SelectItem value="12">Class 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faculty">
                            <AccordionTrigger>Faculty</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup value={faculty} onValueChange={handleFacultyChange}>
                                    {["science","management"].map(f => (
                                        <div className="flex items-center space-x-2" key={f}>
                                            <RadioGroupItem value={f} id={f} />
                                            <Label htmlFor={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}

                {(level === "bachelors" || level === "masters") && (
                    <>
                        <AccordionItem value="faculty">
                            <AccordionTrigger>Faculty</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup value={faculty} onValueChange={handleFacultyChange}>
                                    {["engineering","medical","business","it"].map(f => (
                                        <div className="flex items-center space-x-2" key={f}>
                                            <RadioGroupItem value={f} id={`${f}-${level}`} />
                                            <Label htmlFor={`${f}-${level}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="year">
                            <AccordionTrigger>Year</AccordionTrigger>
                            <AccordionContent>
                                <Select value={year} onValueChange={handleYearChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(level === "bachelors" ? [1,2,3,4] : [1,2]).map(y => (
                                            <SelectItem key={y} value={y.toString()}>{`Year ${y}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}

                {level === "exam" && (
                    <AccordionItem value="examType">
                        <AccordionTrigger>Exam Type</AccordionTrigger>
                        <AccordionContent>
                            <RadioGroup value={faculty} onValueChange={handleFacultyChange}>
                                {["losewa","engineering-entrance","it-entrance"].map(e => (
                                    <div className="flex items-center space-x-2" key={e}>
                                        <RadioGroupItem value={e} id={e} />
                                        <Label htmlFor={e}>{e.replace('-', ' ').toUpperCase()}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            <div className="mt-6 space-y-2">
                <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
                <Button onClick={handleClearFilters} variant="outline" className="w-full">Clear Filters</Button>
            </div>
        </div>
    )
}