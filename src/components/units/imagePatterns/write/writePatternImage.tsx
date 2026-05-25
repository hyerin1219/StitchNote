import { useAlert } from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import SelectCrochetSymbol from '@/components/ui/selectCrochetSymbol';

type IProps = {
    items: { id: string; row: number; symbols: string[] }[];
    setItems: React.Dispatch<React.SetStateAction<{ id: string; row: number; symbols: string[] }[]>>;
};

export default function WritePatternImage({ items, setItems }: IProps) {
    const { showAlert, alertValue, triggerAlert } = useAlert();

    // 삭제하기
    const handleRemoveSymbol = (rowIdx: number, symbolIdx: number) => {
        setItems((prev) =>
            prev.map((el, i) =>
                i === rowIdx
                    ? {
                          ...el,
                          symbols: el.symbols.filter((_, j) => j !== symbolIdx),
                      }
                    : el
            )
        );
    };

    // 단 추가
    const handleAddSymbol = (value: string) => {
        setItems((prev) => {
            if (prev.length === 0) {
                return [
                    {
                        id: crypto.randomUUID(),
                        row: 1,
                        symbols: [value],
                    },
                ];
            }

            return prev.map((item, idx) => {
                if (idx !== prev.length - 1) return item;

                return {
                    ...item,
                    symbols: [...item.symbols, value], //새 객체
                };
            });
        });
    };

    // 확인
    const handleAddRow = () => {
        setItems((prev) => [
            ...prev,
            {
                id: `${Date.now()}`,
                row: prev.length + 1,
                symbols: [],
            },
        ]);
    };

    return (
        <div className="bg-white p-4 rounded-xl  border border-gray-100 shadow-sm">
            <div className="flex justify-between gap-2">
                {/* 코바늘 기술 */}
                <div className="grid grid-cols-3  gap-2  p-2">
                    <SelectCrochetSymbol clickEvent={handleAddSymbol} />
                </div>

                {/* 단수 */}
                <div className="flex-1 space-y-4 bg-gray-50 p-3 rounded-lg border border-gray-100 ">
                    <div className="flex flex-col gap-2 overflow-y-auto h-105">
                        {items.map((row, rowIdx) => (
                            <div key={rowIdx} className="flex items-center gap-2">
                                {/* 단수 */}
                                <span className="text-sm text-gray-500 w-6">{rowIdx + 1}단</span>

                                {/* 심볼 */}
                                <div className="flex items-center gap-1 flex-wrap">
                                    {row.symbols.map((el, idx) => (
                                        <div key={idx}>
                                            <p className="text-center text-sm">{idx + 1}</p>

                                            <div className="relative w-10 h-10 p-1 rounded bg-gray-100 group">
                                                <button type="button" onClick={() => handleRemoveSymbol(rowIdx, idx)} className="absolute -top-1 -right-1 w-4 h-4 text-xs text-center leading-[18px] bg-black text-white rounded-full hidden group-hover:block">
                                                    ×
                                                </button>

                                                <img src={`/images/stitch/${el}.png`} className="w-full h-full object-contain" alt={el} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 단 추가 버튼 */}
                    <Button type="button" size="sm" onClick={handleAddRow}>
                        단 추가
                    </Button>
                </div>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
