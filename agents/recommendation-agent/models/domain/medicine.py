from pydantic import BaseModel, Field

class Medicine(BaseModel):
    brand_name: str = Field(
        description="The commercial/brand name of the medicine",
        default="N/A"
    )
    generic_name: str = Field(
        description="The generic/scientific name of the medicine", 
        default="N/A"
    )
    manufacturer: str = Field(
        description="The manufacturer/company that produces the medicine",
        default="N/A"
    )
    product_ndc: str = Field(
        description="National Drug Code - unique identifier for the drug product",
        default="N/A"
    )
    