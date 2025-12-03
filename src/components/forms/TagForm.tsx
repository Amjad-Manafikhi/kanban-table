import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { toast } from "react-hot-toast"


type Props = {
    company_id?: number;
    reFetch: (() => Promise<void>) | (() => Promise<{
        data: null;
        loading: boolean;
        error: null;
    } | undefined>)
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Form({ company_id, reFetch, setOpen }: Props) {
    const [formValues, setFormValues] = useState({ tagName: "" });
    const colors = [
        "#4A90E2", // Blue (Primary)
        "#50E3C2", // Mint Green (Cyan/Teal)
        "#F5A623", // Gold/Orange (Warning)
        "#BD10E0", // Vivid Purple
        "#FF69B4", // Hot Pink
        "#7ED321", // Lime Green (Success)
        "#9013FE", // Deep Indigo
        "#4A4A4A"  // Dark Gray (Neutral)
    ];
    const [choosenColor, setChoosenColor] = useState(colors[0]);


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormValues(
            prev => (
                {
                    ...prev,
                    [name]: value
                }
            )
        )
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const res = await fetch('/api/tags/create', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newTag: {
                        color: choosenColor,
                        tagName: formValues.tagName,
                        company_id: company_id,
                    }
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Submited Successfully!')
                console.log('created:', data);
                reFetch();
                setOpen(false);
                // Optionally refresh state or re-fetch patients here
            } else {
                toast.error(`Error Creating task`)
                console.error('create task failed:', data.message);
            }
        } catch (error) {
            console.error(`Error creating tag:`, error);
        }

        // setFormValues(intialFormValues);

    }

    const options = colors?.map((color) => {
        return (
            <div
                key={color}
                onClick={() => setChoosenColor(color)}
                // Apply static Tailwind classes for size, shape, and flexibility
                className={`
                    w-12 h-7 flex-shrink-0 rounded-md cursor-pointer transition-all duration-200
                    ${choosenColor === color
                        ? "border-2 border-white shadow-lg ring-4 ring-offset-2 ring-opacity-75 ring-blue-500 transform scale-105"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }
                `}
                // <--- THE FIX IS HERE --->
                style={{ backgroundColor: color }}
            >
            </div>
        )
    })


    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col  p-5 w-[60%] max-w-[500px] m-auto border rounded-md" action="">

                <input
                    type="text"
                    name="tagName"
                    value={formValues.tagName}
                    onChange={handleChange}
                    className="border w-full h-8 rounded-md text-sm px-3"
                    placeholder='Tag Name'
                />

                <label className="mt-2" htmlFor="description">Choose a Tag Color:</label>
                <div className="mb-4 flex items-center mt-4">
                    <span className="text-sm mr-3">Selected Color:</span>
                    <div
                        className="w-14 h-6 rounded-full border border-gray-300 transition-colors duration-300"
                        style={{ backgroundColor: choosenColor }}>
                    </div>
                    <span className="ml-2 font-mono text-sm text-gray-600">{choosenColor}</span>
                </div>
                <div className='w-full flex gap-3 flex-wrap mb-2'>
                    {options}
                </div>


                <button
                    className=" mt-4 m-auto bg-blue-500 rounded-md px-4 py-2 text-sm font-bold items-center justify-center text-white cursor-pointer "
                    type="submit">Submit</button>
            </form>
        </>
    )

}
