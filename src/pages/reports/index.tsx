import {Card} from "@/shared/ui/card";
import {Carousel, CarouselContent, CarouselItem} from "@/shared/ui/carousel";

import {CategoriesReport} from "@/pages/reports/ui/CategoriesReport/CategoriesReport";
import {getMainContentHeight} from "@/shared/lib/styling";

export const REPORTS_PAGE_PADDING = 16;

const ReportsPage = () => {
  return (
    <div style={{padding: REPORTS_PAGE_PADDING}}>
      <Carousel className="w-full max-h-full">
        <CarouselContent>
          <CarouselItem>
            <Card
              className="p-4 overflow-auto box-border"
              style={{height: getMainContentHeight() - REPORTS_PAGE_PADDING * 2}}
            >
              <CategoriesReport />
            </Card>
          </CarouselItem>
        </CarouselContent>
        {/*<CarouselPrevious />*/}
        {/*<CarouselNext />*/}
      </Carousel>
    </div>
  );
};

export default ReportsPage;
