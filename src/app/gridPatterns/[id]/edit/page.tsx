import PatternsWriteGird from '@/components/units/gridPatterns/write';

export default async function GridPatternsEditPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    return <PatternsWriteGird mode="edit" id={resolvedParams.id} />;
}
