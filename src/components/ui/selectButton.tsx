type IOption = {
    value: string;
    label: string;
};

type IProps = {
    options: readonly IOption[];
    value: string;
    onChange: (value: string) => void;
};

export function SelectButtonGroup({ options, value, onChange }: IProps) {
    return (
        <div className="flex items-center gap-3 flex-wrap ">
            {options.map((el) => (
                <button
                    key={el.value}
                    type="button"
                    onClick={() => onChange(el.value)}
                    className={` px-3 py-1 rounded-full font-medium transition-all duration-200 text-lg
                    ${value === el.value ? 'bg-[var(--color04)] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-[var(--color04)] hover:text-white'}
                `}
                >
                    {el.label}
                </button>
            ))}
        </div>
    );
}
