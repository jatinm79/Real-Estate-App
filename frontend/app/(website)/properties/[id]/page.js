"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from '../../components/Footer';
import ImageCarousel from "../../components/ImageCarousel";
import { propertyAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await propertyAPI.getById(propertyId);
        setProperty(response.data.property);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link href="/properties" className="btn btn-primary">
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = [
    property.main_image,
    ...(property.gallery_images || []),
  ].filter(Boolean);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/properties"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ImageCarousel images={allImages} alt={property.project_name} />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {property.project_name}
                </h1>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 mr-3" />
                    <span className="text-lg">{property.builder_name}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700 font-medium mb-2">
                  Price
                </p>
                <p className="text-3xl lg:text-4xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <div className="prose prose-lg text-gray-600">
                  {property.description ? (
                    <p className="whitespace-pre-wrap">
                      {property.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description provided for this property.
                    </p>
                  )}
                </div>
              </div>

              {property.highlights && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Highlights
                  </h3>
                  <div className="prose prose-lg text-gray-600">
                    <p className="whitespace-pre-wrap">{property.highlights}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
