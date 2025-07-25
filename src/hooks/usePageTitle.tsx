import { useContext, useEffect } from "react";
import { PageTitleContext } from "../contexts";

export const usePageTitle = (key: string) => {
  const { setPageTitle } = useContext(PageTitleContext)

  useEffect(() => {
    setPageTitle?.call(this, key)
  }, [key, setPageTitle]);
}
