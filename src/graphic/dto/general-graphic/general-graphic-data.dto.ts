import { Transform } from "class-transformer";

export class GeneralGraphicDataDTO {
    quantity: number
    @Transform(({ value }) => Math.round(value * 100) / 100)
    total: number
    @Transform(({ value }) => Math.round(value * 100) / 100)
    totalOpen: number
    @Transform(({ value }) => Math.round(value * 100) / 100)
    totalPayed: number


    private constructor(
        quantity: number,
        total: number,
        totalOpen: number,
        totalPayed: number) {
        this.quantity = quantity;
        this.total = total;
        this.totalOpen = totalOpen;
        this.totalPayed = totalPayed;

    }

    static build({
        quantity,
        total,
        totalOpen,
        totalPayed }: GeneralGraphicDataDTO): GeneralGraphicDataDTO {
        return new GeneralGraphicDataDTO(
            quantity,
            total,
            totalOpen,
            totalPayed)
    }


}