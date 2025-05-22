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
import { useState } from "react"

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
    const handleApplyFilters = () => {
        onFilterChange({ level, faculty, year, classNum })
    }

    const handleClearFilters = () => {
        setLevel("")
        setFaculty("")
        setYear("")
        setClassNum("")
        onFilterChange({ level: "", faculty: "", year: "", classNum: "" })
    }
    return (
        <div className="bg-white p-4 rounded-lg border sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Filter Books</h2>

            <Accordion type="single" collapsible defaultValue="level">
                <AccordionItem value="level">
                    <AccordionTrigger>Education Level</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={level}
                            onValueChange={(val) => setLevel(val)}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="school" id="school" />
                                    <Label htmlFor="school">School (1-10)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="highschool" id="highschool" />
                                    <Label htmlFor="highschool">High School (11-12)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bachelors" id="bachelors" />
                                    <Label htmlFor="bachelors">Bachelor&apos;s</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="masters" id="masters" />
                                    <Label htmlFor="masters">Master&apos;s</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="exam" id="exam" />
                                    <Label htmlFor="exam">Exam Preparation</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                {level === "school" && (
                    <AccordionItem value="class">
                        <AccordionTrigger>Class</AccordionTrigger>
                        <AccordionContent>
                            <Select value={classNum} onValueChange={setClassNum}>
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
                                <Select value={classNum} onValueChange={setClassNum}>
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
                                <RadioGroup value={faculty} onValueChange={setFaculty}>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="science" id="science" />
                                            <Label htmlFor="science">Science</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="management" id="management" />
                                            <Label htmlFor="management">Management</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}

                {level === "bachelors" && (
                    <>
                        <AccordionItem value="faculty">
                            <AccordionTrigger>Faculty</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup value={faculty} onValueChange={setFaculty}>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="engineering" id="engineering" />
                                            <Label htmlFor="engineering">Engineering</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="medical" id="medical" />
                                            <Label htmlFor="medical">Medical</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="business" id="business" />
                                            <Label htmlFor="business">Business</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="it" id="it" />
                                            <Label htmlFor="it">IT</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="year">
                            <AccordionTrigger>Year</AccordionTrigger>
                            <AccordionContent>
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">First Year</SelectItem>
                                        <SelectItem value="2">Second Year</SelectItem>
                                        <SelectItem value="3">Third Year</SelectItem>
                                        <SelectItem value="4">Fourth Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}

                {level === "masters" && (
                    <>
                        <AccordionItem value="faculty">
                            <AccordionTrigger>Faculty</AccordionTrigger>
                            <AccordionContent>
                                <RadioGroup value={faculty} onValueChange={setFaculty}>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="engineering" id="engineering-masters" />
                                            <Label htmlFor="engineering-masters">Engineering</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="medical" id="medical-masters" />
                                            <Label htmlFor="medical-masters">Medical</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="business" id="business-masters" />
                                            <Label htmlFor="business-masters">Business</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="it" id="it-masters" />
                                            <Label htmlFor="it-masters">IT</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="year">
                            <AccordionTrigger>Year</AccordionTrigger>
                            <AccordionContent>
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">First Year</SelectItem>
                                        <SelectItem value="2">Second Year</SelectItem>
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
                            <RadioGroup value={faculty} onValueChange={setFaculty}>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="losewa" id="losewa" />
                                        <Label htmlFor="losewa">LOSEWA</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="engineering-entrance" id="engineering-entrance" />
                                        <Label htmlFor="engineering-entrance">Engineering Entrance</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="it-entrance" id="it-entrance" />
                                        <Label htmlFor="it-entrance">IT Entrance</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            <div className="mt-6 space-y-2">
                <Button onClick={handleApplyFilters} className="w-full">
                    Apply Filters
                </Button>
                <Button onClick={handleClearFilters} variant="outline" className="w-full">
                    Clear Filters
                </Button>
            </div>
        </div>
    )
}