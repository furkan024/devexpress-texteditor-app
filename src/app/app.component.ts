import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { create, createOptions, RichEdit, Options, RibbonTabType, FileTabItemId, PageLayoutTabItemId, RibbonTab, FirstLevelRibbonItem, RibbonButtonItem, RibbonSelectBoxItem } from 'devexpress-richedit';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy  {
  title = 'devexpress-texteditor-app';
  @ViewChild('richEditContainer', { static: false }) richEditContainer!: ElementRef;
  private rich: RichEdit | null = null;
  //richEdit!: RichEdit.RichEdit;
  dataSource: any[] = [{ value: "option1", text: "Seçenek 1" },
    { value: "option2", text: "Seçenek 2" },
    { value: "option3", text: "Seçenek 3" }]
  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    const options = createOptions();
    options.width = '100%';
    options.height = '800px';
    options.ribbon.visible = true; // Ribbon'u etkinleştir

    this.ribbonCustomization(options);

    this.rich = create(this.element.nativeElement.firstElementChild, options);

  }

  ngOnDestroy() {
    if (this.rich) {
      this.rich.dispose();
      this.rich = null;
    }
  }

  ribbonCustomization(options: Options) {
    const fileTab = options.ribbon.getTab(RibbonTabType.File);
    if(fileTab){
      fileTab.removeItem(FileTabItemId.ExportDocument);
      fileTab.removeItem(FileTabItemId.DownloadHtml);
      fileTab.removeItem(FileTabItemId.DownloadRtf);
      fileTab.removeItem(FileTabItemId.DownloadTxt);
    }

    options.ribbon.removeTab(RibbonTabType.References);
    options.ribbon.removeTab(RibbonTabType.MailMerge);
    options.ribbon.removeTab(RibbonTabType.View);

    const pageLayoutTab = options.ribbon.getTab(RibbonTabType.PageLayout);
    if(pageLayoutTab){
      pageLayoutTab.removeItem(PageLayoutTabItemId.MarginsMenu);
      pageLayoutTab.removeItem(PageLayoutTabItemId.OrientationMenu); 
    }

    const insertTab = options.ribbon.getTab(RibbonTabType.Insert);
    if(insertTab){
      const dropdownId = 'CustomDropdownId';

      const dropdownItem = new RibbonSelectBoxItem(dropdownId, this.dataSource);

      insertTab.insertItem(dropdownItem);
      console.log("Dropdown Insert sekmesine eklendi!");

      // Kullanıcının dropdown seçimlerini yönetmek için event ekleyelim
      options.events.customCommandExecuted = (s, e) => {
          if (e.commandName === dropdownId) {
              const selectedOption = e.parameter;
              console.log("🔹 Seçilen Değer:", selectedOption);
              alert(`Seçilen değer: ${selectedOption}`);
          }
      };
    }


    const findTabId = 'FindTabId';
    const newFindTab = options.ribbon.insertTab(new RibbonTab('Find', findTabId), 2);

    // add custom item
    const findInGoogleId = 'FindInGoogleId';
    newFindTab.insertItem(new RibbonButtonItem(findInGoogleId, 'Find in Google', { beginGroup: true }));
    options.events.customCommandExecuted = (s, e) => {
      if (e.commandName === findInGoogleId) {
        const selectedInterval = s.selection.intervals[0];
        if (selectedInterval.length > 0) {
          const selectedText = s.selection.activeSubDocument.getText(selectedInterval);
          window.open(`https://www.google.com/search?q=${selectedText}`, '_blank');
        }
      }
    };
  }

}
