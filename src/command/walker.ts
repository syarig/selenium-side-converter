
export interface Walker {
    default(dirpath: string): void
    catch(e: any): void
}